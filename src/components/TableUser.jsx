import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddUser from './ModalAddUser';
import ModalEditUser from './ModalEditUser';
import ModalDeleteUser from './ModalDeleteUser';
import _, { debounce } from "lodash"

export default function TableUser(props) {
  const [listUser, setListUser] = useState([])
  const [totalUser,setTotalUser]= useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [showAddUser, setIsShowAddUser] = useState(false);
  const [showEditUser, setIsShowEditUser] = useState (false)
  const [dataUser,setDataUser] = useState({})

  const [isShowDelete, setIsShowDelelte] = useState(false)
  const [dataUserDelete, setDataUserDelete] = useState({})

  const [sortBy,setSortBy] = useState("asc")
  const [sortField, setSortField] = useState("id")


  const handleClose = () => {
    setIsShowAddUser(false) // close modal
    setIsShowEditUser(false)
    setIsShowDelelte(false)
  }
  useEffect(()=>{
    // call api
    getUser()
  },[])
  const getUser = async (page)=>{
    const res = await fetchAllUser(page)
    if(res && res.data)
    {
      setListUser(res.data)
      setTotalUser(res.total)
      setTotalPage(res.total_pages)
    }
  } 

  const handlePageClick = (event)=>{
    // next page
    getUser(+event.selected + 1) 
  }

  const handleUpdateUser = (user)=>{
    setListUser([user,...listUser]) // clone listUser và push user mới vào mảng .
    console.log("user",user);
  }

  const handleEditUser = (user)=>{
    setDataUser(user) // set name vào modal edit
    let cloneListUser = [...listUser] // clone list User bằng lodash _.cloneDeep(listUser)
    let index = cloneListUser.findIndex(item => item.id === user.id) // tìm index cần edit
    cloneListUser[index].first_name = user.first_name 
    console.log(cloneListUser)
  }

  const hanldeDelete = (user) =>{
    setIsShowDelelte(true)
    setDataUserDelete(user)
   
  }
   
  const handleDeleteUserFormModal = (user)=>{
    let cloneListUser = _.cloneDeep(listUser)
    cloneListUser = cloneListUser.filter(item => item.id !== user.id)// filter các user có id khác với id được selected !
    setListUser(cloneListUser) // set lại list user được clone ra 
  }

  const handleSort = (sortBy, sortField)=>{
    setSortBy(sortBy)
    setSortField(sortField)
    let cloneListUser = _.cloneDeep(listUser)
    cloneListUser = _.orderBy(cloneListUser,[sortField],[sortBy])// Use Lodash to sort array by 'name'
    setListUser(cloneListUser)// set list user
    console.log(cloneListUser)
  }

  const handleSearch = debounce((event)=>{
    let term = event.target.value 
    console.log(term)
    if(term){
      let cloneListUser = _.cloneDeep(listUser)
        cloneListUser = _.filter(cloneListUser, item => item.email.includes(term))
        // filter lodash lọc email theo includes 
        setListUser(cloneListUser)
        console.log(cloneListUser)
    }else{
      getUser(1)
    }
  },500)
  return (
    <>
    <div className='my-2 d-flex justify-content-between'>
          List User :
          <button className='btn btn-primary' onClick={() => {
            setIsShowAddUser(true)
          }} >
            Add New User
          </button>
        </div>
        <div className='my-3 col-4'>
          <input 
           className='form-control'
           placeholder='Search user by email  ...'
          //  value={keyword}
           onChange={(event)=>handleSearch(event)}// handle search

            />
        </div>
    <div>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>
            <div className='d-flex justify-content-between'>
              <span>
              <i className="fa-solid fa-user"></i>
              </span>
              <span style={{cursor:"pointer"}}>
               <i 
               className="fa-solid fa-arrow-up mx-1"
               onClick={()=>handleSort("asc","id")}
               ></i>
               <i
                className="fa-solid fa-arrow-down"
                onClick={()=>handleSort("desc","id")}
               ></i>
              </span>
            </div>
       
    
            </th>
          <th>Email</th>
          <th>
            <div className='d-flex justify-content-between'>
            <span>First Name</span>
            <span style={{cursor:"pointer"}}>
               <i 
               className="fa-solid fa-arrow-up mx-1"
               onClick={()=>handleSort("asc","first_name")}
               ></i>
               <i 
               className="fa-solid fa-arrow-down"
               onClick={()=>handleSort("desc","first_name")}
               ></i>
              </span>
            </div>
              
          </th>
          <th>Last Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {listUser && listUser.length > 0 &&
          listUser.map((item,index)=>{
            return(
              <tr key={`User-${index}`} >
              <td>{item.id}</td>
              <td>{item.email}</td>
              <td>{item.first_name}</td>
              <td>{item.last_name}</td>
              <td>
                <button
                 className='btn btn-warning ms-3'
                 onClick={()=>{
                  handleEditUser(item)
                  setIsShowEditUser(true)
                 }}
                 >Edit</button>
                <button
                 className='btn btn-danger ms-3'
                 onClick={()=>{
                  hanldeDelete(item)
                 }}
                 >Delete</button>
              </td>
            </tr>
            )
          })
        }
        
      </tbody>
    </Table>
    <div className='d-flex justify-content-center'>
    <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        pageCount={totalPage}
        previousLabel="< previous"
        pageClassName='page-item'
        pageLinkClassName='page-link'
        previousClassName='page-item'
        previousLinkClassName='page-link'
        nextClassName='page-item'
        nextLinkClassName='page-link'
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName='pagination'
        activeClassName='active'
      />
    </div>
    </div>
    <ModalAddUser showAddUser={showAddUser} handleClose={handleClose} handleUpdateUser = {handleUpdateUser} />
    <ModalEditUser showEditUser ={showEditUser} handleClose={handleClose} dataUser={dataUser}
    handleEditUser ={handleEditUser} />
    <ModalDeleteUser isShowDelete = {isShowDelete} handleClose={handleClose}  dataUserDelete={dataUserDelete} handleDeleteUserFormModal = {handleDeleteUserFormModal}/>
    </>
  )
}
