import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
export default function TableUser(props) {
  const [listUser, setListUser] = useState([])
  const [totalUser,setTotalUser]= useState(0);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(()=>{
    // call api
    getUser(1)
  },[])

  const getUser = async (page)=>{
    const res = await fetchAllUser(page)
    if(res && res.data)
    {
      console.log("response",res)
      setListUser(res.data)
      setTotalUser(res.total)
      setTotalPage(res.total_pages)
    }
  } 
  console.log("list", listUser)
  const handlePageClick = (event)=>{
    // next page
    getUser(+event.selected + 1)
  }
  return (
    <div>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Email</th>
          <th>First Name</th>
          <th>Last Name</th>
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
            </tr>
            )
          })
        }
        
      </tbody>
    </Table>
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
  )
}
