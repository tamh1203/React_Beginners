
import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import {putUpdateUser} from "../services/UserService"
import {toast } from 'react-toastify';

export default function ModalEditUser(props) {
  const { showEditUser,handleClose,dataUser,handleEditUser} = props
  const [name,setName] = useState("");
  const [job,setJob] = useState("");

  const handleEditChanges = async ()=>{
   let res = await putUpdateUser(name,job)
   handleEditUser({
    first_name : name,
    id : dataUser.id
   })
   toast("Edit user success ! ")
   handleClose()
   console.log("res",res);
  }

  useEffect(()=>{
    if(showEditUser){
      setName(dataUser.first_name)
    }
  },[dataUser])
  return (
    <div>
      <Modal 
            show={showEditUser}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
       >
        <Modal.Header closeButton>
          <Modal.Title>Add New User </Modal.Title>
        </Modal.Header>
        <Modal.Body>
    <div>
      <div className="mb-3">
        <label  className="form-label">NAME</label>
        <input type="text"
         className="form-control" 
         value={name}
         onChange={(e)=>setName(e.target.value)}
         />
      </div>
      <div className="mb-3">
        <label  className="form-label">JOB</label>
        <input type="text "
         className="form-control" 
         value={job}
         onChange={(e)=>setJob(e.target.value)}
         />
      </div>
      </div>
        </Modal.Body>
        <Modal.Footer>

          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{
            handleEditChanges()
          }}>
            Confirm 
          </Button>
        </Modal.Footer>
        </Modal>
    </div>
  )
}



