import React from 'react'
import { Modal, Button, FormGroup, ControlLabel,
  FormControl } from 'react-bootstrap'

import PhotoInput from './photoInput.js'
import { postContributors } from 'utils/api.js'

const defaultState = {
  isOpen: false,
  photo: undefined,
  name: '',
  submitting: false
}

export default class InviteContributorModal extends React.PureComponent {
  state = {...defaultState}
  render = () => {
    const { isOpen, photo, name, submitting } = this.state

    return <Modal show={isOpen} onHide={this._close}>
      <Modal.Header closeButton>
        <Modal.Title>Invite a Contributor...</Modal.Title>
      </Modal.Header>

      <form onSubmit={this._submitForm}>
        <Modal.Body>
          <PhotoInput photo={photo} onDrop={this._changePhoto} />
          <FormGroup controlId='name'>
            <ControlLabel>Name</ControlLabel>
            <FormControl autoFocus required minLength='1' autoComplete='name'
              placeholder='Jane Doe' value={name} onChange={this._changeName} />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button disabled={submitting} onClick={this._close}>Close</Button>
          <Button bsStyle='success' disabled={submitting} type='submit'>
            Invite
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  }

  open = () => {
    this.setState({isOpen: true})
  }
  _close = () => {
    if (this.state.submitting) { return } // wait for submission to finish
    this.setState({isOpen: false})
  }

  _changePhoto = (files) => {
    console.log(files)
    this.setState({photo: files[0]})
  }
  _changeName = (ev) => {
    const name = ev.target.value // store outside of synthetic ev
    this.setState({name})
  }
  _submitForm = async (ev) => {
    ev.preventDefault() // don't do a sync submit

    const { photo, name } = this.state
    if (!photo || !name) { return } // reject if invalid

    if (this.state.submitting) { return } // debounce
    this.setState({submitting: true})
    const { path } = await postContributors(name, photo)

    this.props.afterSubmit({name, path})
    this.setState({...defaultState}) // reset state after a submission
  }
}
