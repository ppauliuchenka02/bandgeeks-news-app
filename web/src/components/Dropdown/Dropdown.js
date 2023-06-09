import { Link, routes, useLocation } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
// Results data filtered using categories

const GETUSERICON = gql`
  query User($id: Int!) {
    fetchUserbyId(id: $id) {
      icon
    }
  }
`
const ListElements = () => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const { pathname } = useLocation()
  const activeRoute = window.localStorage.getItem('activeRoute') || pathname
  window.localStorage.setItem('activeRoute', activeRoute)

  return (
    <p className="absolute right-4 z-10 mt-4 w-48 origin-top-right rounded-md border bg-white py-1 text-gray-700 shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-white dark:bg-gray-700 dark:text-white dark:shadow-white md:right-28">
      {isAuthenticated ? (
        <div className={'border-b px-4 py-2'}>
          <p className={'font-mono font-thin lowercase'}>signed in as</p>
          <p className={'font-bold uppercase'}>{currentUser.email}</p>
        </div>
      ) : (
        <Link
          to={routes.login()}
          className={'block border-b px-4 py-2 text-sm'}
          aria-label="login-link"
        >
          <i className="fa-solid fa-user-tie mr-2"></i>Login
        </Link>
      )}
      {isAuthenticated ? (
        <div className={'border-t'}>
          <div className="block px-4 py-2 text-sm">
            <Link to={routes.settings()}>Settings</Link>
          </div>
          <div className="block px-4 py-2 text-sm">
            <Link to={routes.bubbles()}>Bubbles Game</Link>
          </div>
          <div className="block px-4 py-2 text-sm">
            <button onClick={logOut}>Log Out</button>
          </div>
        </div>
      ) : (
        ''
      )}
    </p>
  )
}

function Dropdown() {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const { data, loading, error } = useQuery(GETUSERICON, {
    variables: { id: isAuthenticated ? currentUser.id : 0 },
  })
  const [display, setDisplay] = React.useState(false)
  const handleClick = () => {
    display === false ? setDisplay(true) : setDisplay(false)
  }
  if (loading) return 'Loading...'
  let iconClass =
    'fa-regular ' +
    (data == undefined ? 'fa-circle-user' : data['fetchUserbyId']['icon']) +
    ' fa-xl'
  console.log(iconClass)

  return (
    <div>
      <button
        type="button"
        className="items-left flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        onClick={handleClick}
      >
        {isAuthenticated ? (
          <div
            className={'flex items-center text-sm font-normal'}
            aria-label="user-icon"
          >
            <i className={iconClass}></i>
            <p className={'mx-1'}>Account</p>
            <i className="fa-solid fa-caret-down"></i>
          </div>
        ) : (
          <div className={'block lg:hidden'}>
            <div className={'flex items-center'}>
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>
        )}
      </button>
      {display ? <ListElements /> : ''}
    </div>
  )
}

export default Dropdown
