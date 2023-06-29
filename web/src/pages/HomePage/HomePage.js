import { useState, useEffect } from 'react'

import { MetaTags, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Discussions from 'src/components/Discussions'
import PoliticalNews from 'src/components/PoliticalNews'
import Search from 'src/components/Search'
import TopNewsSlider from 'src/components/TopNewsSlider'
const API_KEY = process.env.API_KEY;

const getusr = gql`
  query User($id: Int!) {
    fetchUserbyId(id: $id) {
      newsGeneral
      newsBusiness
      newsEntertainment
      newsHealth
      newsScience
      newsSports
      newsTechnology
    }
  }
`
export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'cache-and-network' }
}
const HomePage = () => {
  const [articles, setArticles] = useState([])
  const [section, setState] = useState('')
  const [PageNUM, setPageNUM] = useState(1);
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const { data, loading, error } = useQuery(getusr, {
    variables: { id: currentUser == null ? -1 : currentUser.id },
  })
  let pageNo = new URL(window.location.href).searchParams.get('page')
  pageNo = pageNo == null ? 1 : pageNo
  if (currentUser != null && !loading && section == '') {
    let tmp = ''
    for (var x in data.fetchUserbyId) {
      if (data.fetchUserbyId[x] == true) {
        tmp = x.substring(4).toLocaleLowerCase()
      }
    }
    setState(tmp)
  }

  console.log('Section = ', section)
  // fetching data from newsapi
  useEffect(() => {
    const getArticles = async () => {
      const getParam = new URL(window.location.href).searchParams.get('q')
      console.log('getParam = "', getParam, '"')
      let url =
        getParam == '' || getParam == null
          ? 'https://newsapi.org/v2/top-headlines?category=' +
            encodeURIComponent(section) +
            '&sortBy=publishedAt&country=us&pageSize=3&page=' +
            PageNUM + // country
            '&apiKey=' + API_KEY// api key
          : 'https://newsapi.org/v2/everything?q=' +
            encodeURIComponent(getParam) +
            '&sortBy=publishedAt&pageSize=3&page=' +
            PageNUM +
            '&apiKey=' + API_KEY// api key
      try {
        // fetching articles from api ande converting to json
        console.log('articles have been set to:', url)
        const response = await fetch(url)
        let json = await response.json()
        setArticles(json.articles)
      } catch (error) {
        console.error('Error fetching articles:', error)
      }
    }
    if (section != true) getArticles()
  }, [section, PageNUM])

  // formating publishedAt to have only date
  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return dateObj.toLocaleDateString(undefined, options)
  }

  const next = () => {
    setPageNUM(PageNUM + 1)
  };

  const prev = () => {
    if(PageNUM > 1){
      setPageNUM(PageNUM - 1);
    }
  }

  if (loading) return <div>Loading...</div>
  return (
    <>
      <MetaTags title="General" description="General page" />
      <button
              name="page"
              /* value={Number(pageNo) <= 0 ? 1 : Number(pageNo) - 1} */
              onClick={prev}
              style={{color:'black', padding: 25, textAlign: 'center', margin: 'auto', right: '50px'}}
            >
              Previous
            </button>
            <button name="page" /*value={Number(pageNo) + 1}*/ onClick={next} style={{color: 'black', padding: 25, textAlign: 'center', margin: 'auto', right: '100px'}}>
              Next
            </button>

      <div
        className={'relative grid grid-cols-4 gap-x-6 gap-y-6 px-12 text-white'}
      >
        <div className={'col-span-3'}>
          <TopNewsSlider>
            {articles.map((article, index) => (
              <article
                key={index}
                className={'flex h-96 flex-col justify-end bg-cover p-6'}
                style={{
                  backgroundImage: `linear-gradient(to top, black, transparent), url(${article.urlToImage})`,
                }}
              >
                <div className={'flex h-full flex-col justify-end'}>
                  <p className={'mb-3 font-gruppo text-sm'}>
                    {formatDate(article.publishedAt)}
                  </p>
                  <a
                    href={article.url}
                    target={'_blank'}
                    className={'hover:underline hover:underline-offset-4'}
                    rel="noreferrer"
                  >
                    <h2
                      className={'font-playfair text-lg font-bold lg:text-xl'}
                    >
                      {article.title}
                    </h2>
                  </a>
                </div>
              </article>
            ))}
          </TopNewsSlider>
            <button
              name="page"
              /* value={Number(pageNo) <= 0 ? 1 : Number(pageNo) - 1} */
              onClick={prev}
              style={{color:'black', padding: 25, textAlign: 'center', margin: 'auto'}}
            >
              Previous
            </button>
            <button name="page" /*value={Number(pageNo) + 1}*/ onClick={next} style={{color: 'black', padding: 25, textAlign: 'center', margin: 'auto', right: '100px'}}>
              Next
            </button>

          <PoliticalNews></PoliticalNews>
        </div>
        <div>
          <Search></Search>
          <Discussions></Discussions>
        </div>
      </div>
    </>
  )
}

export default HomePage
