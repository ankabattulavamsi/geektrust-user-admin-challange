import {Component} from 'react'

import Pagination from 'react-js-pagination'
import History from './components/History'

import './App.css'

const apiStatusContent = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class App extends Component {
  state = {
    userDetails: [],
    activePage: 10,
    offset: 0,
    limit: 10,
    searchInput: '',
    page: 1,
    apiStatus: apiStatusContent.initial,
  }

  componentDidMount() {
    this.getUsers()
  }

  // updating the active page, offset and limit number in state
  handlePageChange = pageNumber => {
    if (pageNumber > 1) {
      this.setState({
        page: pageNumber,
        activePage: pageNumber,
        offset: (pageNumber - 1) * 10,
        limit: pageNumber * 10,
      })
    } else {
      this.setState({
        page: pageNumber,
        activePage: pageNumber,
        offset: 0,
        limit: 10,
      })
    }
  }

  // fetching the users by the given URL
  getUsers = async () => {
    const url =
      ' https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      const updateResponseDataUrl = data.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        email: eachData.email,
        role: eachData.role,
        isChecked: false,
      }))
      this.setState({
        userDetails: updateResponseDataUrl,
        apiStatus: apiStatusContent.success,
      })
    } else if (response.status === 403) {
      this.setState({apiStatus: apiStatusContent.failure})
    }
  }

  // updating the users to select or unselect to delete
  onChangeCheckbox = id => {
    this.setState(prevState => ({
      userDetails: prevState.userDetails.map(eachUser => {
        if (eachUser.id === id) {
          return {...eachUser, isChecked: !eachUser.isChecked}
        }
        return eachUser
      }),
    }))
  }

  // Delete each user by unique id
  onDeleteUserDetails = id => {
    const {userDetails} = this.state
    const deleteEachUser = userDetails.filter(eachUser => eachUser.id !== id)
    this.setState({userDetails: deleteEachUser})
  }

  // Deleting all the selected users by input-checkbox
  onDeleteSelectedUsers = () => {
    const {userDetails} = this.state
    // filter the selected users we want to delete
    const selectedUserstoDelete = userDetails.filter(
      eachUserData => eachUserData.isChecked !== true,
    )
    this.setState({userDetails: selectedUserstoDelete})
  }

  // updating the search Input

  onChangeSearchValue = event => {
    this.setState({searchInput: event.target.value})
  }

  // Retry Url again and display the user data

  onRetryData = () => {
    this.getUsers()
  }

  // Rendering the success view
  onSuccessView = () => {
    const {
      userDetails,
      offset,
      limit,
      searchInput,
      page,
      activePage,
    } = this.state
    console.log(userDetails)
    // get users with the offset and limit values updated in the state and also checking the search values includes in the usersList
    const filteredUsers = userDetails.filter(
      eachUserData =>
        eachUserData.id <= limit &&
        eachUserData.id > offset &&
        (eachUserData.name.toLowerCase().includes(searchInput) ||
          eachUserData.email.toLowerCase().includes(searchInput) ||
          eachUserData.role.toLowerCase().includes(searchInput)),
    )
    return (
      <div className="main-app-container">
        <input
          placeholder="Search by name or email or role"
          value={searchInput}
          onChange={this.onChangeSearchValue}
          type="search"
          className="search-container"
        />
        {filteredUsers.length > 0 ? (
          <>
            <ul className="users-ul-container">
              <div className="responsive">
                <input type="checkbox" className="input-container" />
                <p className="name">Name</p>
                <p className="name">Email</p>
                <p className="name">Roles</p>
                <p className="name">Actions</p>
              </div>
              {filteredUsers.map(eachUser => (
                <History
                  onChangeCheckbox={this.onChangeCheckbox}
                  onDeleteUserDetails={this.onDeleteUserDetails}
                  key={eachUser.id}
                  eachUserData={eachUser}
                />
              ))}
            </ul>
          </>
        ) : (
          <div className="no-data-container">
            <img
              className="no-data-image"
              src="https://image.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg"
              alt="no-data"
            />
            <h1 className="no-data-title">
              No Users in this Page {page}. Go to next Page or Retry.
            </h1>
            <button
              type="button"
              onClick={this.onRetryData}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        )}
        <div className="pagination-container">
          <button
            type="button"
            onClick={this.onDeleteSelectedUsers}
            className="delete-selected"
          >
            Delete Selected
          </button>

          <Pagination
            className="pagination"
            activePage={activePage}
            itemsCountPerPage={10}
            totalItemsCount={userDetails.length}
            pageRangeDisplayed={Math.ceil(userDetails.length / 10)}
            onChange={this.handlePageChange}
          />
        </div>
      </div>
    )
  }

  // rendering the failure view
  failureUsersView = () => (
    <div className="main-app-container">
      <img
        className="no-data-image"
        src="https://image.freepik.com/free-vector/funny-error-404-background-design_1167-219.jpg"
        alt="no-found"
      />
      <button type="button" className="retry-button" onClick={this.onRetryData}>
        Retry
      </button>
    </div>
  )

  onSwitchUserListData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContent.failure:
        return this.failureUsersView()
      case apiStatusContent.success:
        return this.onSuccessView()
      default:
        return null
    }
  }

  render() {
    return this.onSwitchUserListData()
  }
}

export default App
