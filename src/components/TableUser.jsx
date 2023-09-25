import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/UserService';
export default function TableUser(props) {
  const [listUser, setListUser] = useState([])

  useEffect(()=>{
    // call api
    getUser()
  },[])

  const getUser = async ()=>{
    const res = await fetchAllUser()
    if(res && res.data && res.data.data)
    {
      setListUser(res.data.data)
    }
  } 
  console.log("list", listUser)
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
    </div>
  )
}
