
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postCreatUser } from '../services/UserService';

export default function ModalAddUser(props) {
  const {showAddUser, handleClose, handleUpdateUser} = props
  const [name,setName] = useState("");
  const [job,setJob] = useState("");

  const handleSaveChanges = async ()=>{
      const res = await postCreatUser(name,job)
      setName("")
      setJob("")
      handleClose()
      handleUpdateUser({first_name : name, id: res.id})
      if(res && res.id ){
        console.log("Submit success")
      }
      else{
        console.log("submit erro")
      }
  }
  return (
    <div>
       <Modal show={showAddUser} onHide={handleClose}>
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
            handleSaveChanges()
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
