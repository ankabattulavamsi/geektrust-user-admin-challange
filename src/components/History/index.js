import './index.css'

const History = props => {
  const {eachUserData, onDeleteUserDetails, onChangeCheckbox} = props
  const {id, name, email, role, isChecked} = eachUserData

  const onDeleteUser = () => {
    onDeleteUserDetails(id)
  }

  const onChangeUserCheckbox = () => {
    onChangeCheckbox(id)
  }

  // if li container is selected change background-color
  const liBackgroundColor = isChecked ? 'selected-checkbox' : ''

  return (
    <>
      <li className={`user-li-container ${liBackgroundColor}`}>
        <input
          type="checkbox"
          onChange={onChangeUserCheckbox}
          checked={isChecked}
          className="input-container"
        />
        <p className="width">{name}</p>
        <p className="width">{email}</p>
        <p className="width">{role}</p>
        <button onClick={onDeleteUser} className="delete-btn" type="button">
          <img
            className="delete-img"
            src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png"
            alt="delete"
          />
        </button>
      </li>
      <hr />
    </>
  )
}

export default History