import { useState, useEffect } from 'react'

import { Link, routes, useLocation } from '@redwoodjs/router'
import { MetaTags, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Pagination from 'src/components/Pagination'
import Search from 'src/components/Search'

const API_KEY = process.env.API_KEY

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
  const [totalPages, setTotalPages] = useState()
  const [pageNUM, setPageNUM] = useState(1)
  const [activeCategory, setActiveCategory] = useState('')
  const { isAuthenticated, currentUser } = useAuth()
  const { data, loading } = useQuery(getusr, {
    variables: { id: currentUser == null ? -1 : currentUser.id },
  })

  const categories = [
    'general',
    'business',
    'entertainment',
    'technology',
    'sports',
    'health',
    'science',
  ]

  const { pathname } = useLocation()
  const activeRoute = window.localStorage.getItem('activeRoute') || pathname
  window.localStorage.setItem('activeRoute', activeRoute)

  if (
    isAuthenticated &&
    currentUser != null &&
    data != undefined &&
    !loading &&
    section === ''
  ) {
    let tmp = ''
    for (let x in data.fetchUserbyId) {
      if (data.fetchUserbyId[x] === true) {
        tmp = x.substring(4).toLocaleLowerCase()
      }
    }
    setState(tmp)
  }

  useEffect(() => {
    const getArticles = async () => {
      const pageSize = 12
      let totalArticles = 0

      let getParam = new URL(window.location.href).searchParams.get('q')
      let url =
        getParam === '' || getParam == null
          ? `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(
              section
            )}&sortBy=publishedAt&country=us&page=${pageNUM}&apiKey=${API_KEY}`
          : `https://newsapi.org/v2/everything?q=${encodeURIComponent(
              getParam
            )}&sortBy=publishedAt&page=${pageNUM}&apiKey=${API_KEY}`

      try {
        const response = await fetch(url)
        let json = await response.json()

        totalArticles = json.totalResults // Update totalArticles based on API response

        const slicedArticles = json.articles.slice(0, pageSize)
        if (slicedArticles.length > 0 && (getParam != '' || getParam != null))
          setArticles(slicedArticles)
      } catch (error) {
        console.error('Error fetching articles:', error)
      }

      let totalPages = Math.ceil(totalArticles / pageSize)
      setTotalPages(totalPages)
    }

    if (!loading) getArticles()
  }, [section, pageNUM, loading])

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }
    return dateObj.toLocaleString(undefined, options)
  }

  const goToPage = (pageNumber) => {
    setPageNUM(pageNumber)
  }

  const next = () => {
    if (pageNUM < totalPages) {
      setPageNUM(pageNUM + 1)
    }
  }

  // const next = () => {
  //   if (pageNUM < totalPages) {
  //     const nextPage = pageNUM + 1
  //     if (nextPage === totalPages) {
  //       setPageNUM(nextPage)
  //     }
  //   }
  // }
  const prev = () => {
    if (pageNUM > 1) {
      setPageNUM(pageNUM - 1)
    }
  }
  console.log('Total Pages:', articles)
  if (loading) return <div>Loading...</div>
  if (articles == undefined || articles.length == 0)
    return (
      <h2 className={'relative mx-auto px-6 md:w-11/12 md:px-12'}>
        Sorry, looks like we ran out of articles!
      </h2>
    )
  return (
    <>
      <MetaTags title="General" description="General page" />

      <div className={'relative mx-auto px-6 md:w-11/12 md:px-12'}>
        <div
          className={
            'mb-6 border-b-8 border-double border-gray-600 py-3 text-center text-gray-900 dark:border-white'
          }
        >
          <nav className={''}>
            <ul
              className={
                'mx-auto text-xs dark:text-white sm:text-sm md:max-w-7xl md:px-12 lg:flex lg:items-center  lg:justify-between'
              }
            >
              <li
                className={`${
                  pathname === routes.home() && activeCategory === ''
                    ? 'my-1 inline-block rounded bg-purple-600 px-2 py-1 text-white'
                    : 'mx-3 my-1 inline-block'
                }`}
              >
                <Link
                  to={routes.home()}
                  onClick={() => {
                    setState('')
                    setActiveCategory('')
                  }}
                >
                  Home
                </Link>
              </li>

              {categories.map((category) => (
                <li
                  key={category}
                  className={`${
                    activeCategory === category
                      ? 'my-1 inline-block rounded bg-purple-600 px-2 py-1 text-white'
                      : 'mx-3 my-1 inline-block'
                  }`}
                >
                  <Link
                    onClick={() => {
                      setState(category)
                      setActiveCategory(category)
                      setPageNUM(1) // Reset page number when changing category
                    }}
                    className={'cursor-pointer'}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                </li>
              ))}

              <li>
                <Search />
              </li>
            </ul>
          </nav>
        </div>

        {/* ARTICLES SECTION */}
        <div
          className={
            'columns-1 text-white sm:columns-2 lg:columns-3  2xl:columns-4'
          }
        >
          {articles.map((article, index) => {
            const aspectClass =
              Math.random() < 0.5 ? 'aspect-square' : 'aspect-video'

            return (
              <article
                key={index}
                className={`w-full ${aspectClass} mb-4 flex flex-col justify-end bg-black bg-cover p-6`}
                style={{
                  backgroundImage: `linear-gradient(to top, black, transparent), url(${article.urlToImage})`,
                }}
              >
                <div className={'flex h-full flex-col justify-end'}>
                  <p className={'font-gruppo text-sm'}>
                    {formatDate(article.publishedAt)}
                  </p>
                  <a
                    href={article.url}
                    target={'_blank'}
                    className={'hover:underline hover:underline-offset-4'}
                    rel="noreferrer"
                  >
                    <h2
                      className={
                        'font-playfair text-xs font-bold sm:text-base xl:text-xl'
                      }
                    >
                      {article.title}
                    </h2>
                  </a>
                </div>
              </article>
            )
          })}
        </div>

        {/* PAGINATION */}
        <div className={'mt-12 flex justify-center dark:border-white'}>
          <Pagination
            totalPages={totalPages}
            pageNUM={pageNUM}
            goToPage={goToPage}
            prev={prev}
            next={next}
          />
        </div>
      </div>
    </>
  )
}

export default HomePage
