import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddUser from './ModalAddUser';
import ModalEditUser from './ModalEditUser';
import ModalDeleteUser from './ModalDeleteUser';
import _, { debounce } from "lodash"
import { CSVLink } from "react-csv";
import  "./TableCss.scss"
import Papa from 'papaparse';
import {toast } from 'react-toastify';

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

  const [exportData, setExportData] = useState([])

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
  
  const handleExportData = (event,done) =>{   
    let result = []
      if(listUser && listUser.length > 0 ){
        result.push(["ID", "Email","First Name", "Last Name"])
        listUser.map((item,index)=>{
          let arr = []
          arr[0] = item.id
          arr[1] = item.email
          arr[2] = item.first_name
          arr[3] = item.last_name
          result.push(arr)
        })
      }
      setExportData(result)
      done()
  }

     const handleImportCSV = (e)=>{
        if(e.target && e.target.files && e.target.files[0]){
          let file = e.target.files[0]
          if(file.type !== "text/csv"){
            toast("Wrong format CSV file...!")
            return 
          }
            // Parse local CSV file
        Papa.parse(file, {
          // header: true,//cách 1 tạo phần head cho tưởng object 
          complete: function(results) {
            let rawCSV = results.data;
            if(rawCSV.length > 0 ){
              if(rawCSV[0] && rawCSV[0].length === 3){
                if(rawCSV[0][0] !== "email" || rawCSV[0][1] !== "first_name" || rawCSV[0][2] !== "last_name"){
                  toast("Wrong format heading CSV file !")
                }
                else{
                  let result = []
                  rawCSV.map((item, index) => {
                      if(index > 0 && item.length === 3) {
                        let job = {}
                        job.email = item[0]
                        job.first_name = item[1]
                        job.last_name = item[2]
                        result.push(job)
                      }
                  })
                  console.log("check result", result)
                  setListUser(result)
                }
              }else{
                toast("Wrong fomat CSV file !")
              }
            }else{
              toast("Wrong fomat CSV file !")
            }
            console.log("Finished:", results.data);
          }
        });
        }
     }
  return (
    <>
    <div className='my-2 d-flex justify-content-between'>
        <span className='text-primary'>List User :</span>
          <div className='group-btns'>
            <label htmlFor="test" className='btn btn-warning'>
            <i className="fa-solid fa-file-import"></i> Import
              </label>
           <input 
           type='file' 
           id ='test' hidden
           onChange={(e)=>{handleImportCSV(e)}}

           /> 
          <CSVLink 
             className='btn btn-primary'
             data={exportData}
             filename={'my_file.csv'}
             asyncOnClick={true}
             onClick={(event,done)=>{handleExportData(event,done)}}
           >
           <i className="fa-solid fa-file-arrow-down"></i> Export
             </CSVLink>
          <button className='btn btn-success' onClick={() => {
            setIsShowAddUser(true)
          }} >
          <i className="fa-solid fa-circle-plus"></i>  Add New
          </button>
          </div>
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
                 className='btn btn-info ms-3'
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
