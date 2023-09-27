

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {deleteUser} from '../services/UserService'

export default function ModalDeleteUser(props) {
  const {isShowDelete, handleClose,dataUserDelete, handleDeleteUserFormModal} = props
 
  const handleComfirmDel = async ()=>{
   let res = await deleteUser(dataUserDelete.id)
    if(res && +res.statusCode === 204){
      console.log("delete success !")
      handleClose()
      handleDeleteUserFormModal(dataUserDelete)
    }
    else{
      console.log("delete erro");
    }
   console.log("check res",res)
  }

  return (
    <div>
       <Modal show={isShowDelete} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you want to delete now ?   </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
           User with name <b>{dataUserDelete.first_name}</b>  for Email: <b>{dataUserDelete.email}</b>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{
            handleComfirmDel()
          }}>
            Delete Comfirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
