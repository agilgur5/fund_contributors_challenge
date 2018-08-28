import React from 'react'
import { Carousel, Button, Glyphicon, Image,
  DropdownButton, MenuItem } from 'react-bootstrap'

import { chunkArray } from 'utils/helpers.js'
import InviteContributorModal from './inviteContributorModal'
import styles from './app.cssm'

const pageSize = 6 // 6 contributors per page

export default class App extends React.PureComponent {
  state = {
    contributors: []
  }
  modalRef = React.createRef()
  render = () => {
    const { contributors } = this.state

    return <div className={styles.center}>
      <h2>Contributors</h2>
      <br />
      <br />
      {contributors.length > 0 && <Carousel>
        {chunkArray(contributors, pageSize).map(this._renderChunk)}
      </Carousel>}
      <br />
      <br />
      <Button bsStyle='success' onClick={this._openModal}>
        <Glyphicon glyph='plus' /> Invite a Contributor
      </Button>
      <InviteContributorModal ref={this.modalRef}
        afterValid={this._addContributor} />
      <br />
      <br />
    </div>
  }
  _renderChunk = (chunk) => {
    const aggregateKey = chunk.reduce((acc, contributor) => {
      return acc + ' ' + contributor.photo.preview
    }, '')
    return <Carousel.Item key={aggregateKey}>
      {chunk.map(this._renderContributor)}
    </Carousel.Item>
  }
  _renderContributor = (contributor, index) => {
    // photo URIs should be unique
    return <Contributor key={contributor.photo.preview}
      contributor={contributor} index={index}
      deleteIndex={this._deleteContributor} />
  }

  // this is done imperatively similar to a route change
  _openModal = () => {
    this.modalRef.current.open()
  }
  _addContributor = ({name, photo}) => {
    this.setState(({contributors}) => ({contributors: contributors.concat({
      name,
      photo
    })}))
  }
  _deleteContributor = (index) => {
    this.setState(({contributors}) => ({contributors: [
      ...contributors.slice(0, index),
      ...contributors.slice(index + 1)
    ]}))
  }
}

class Contributor extends React.PureComponent {
  render = () => {
    const { contributor, index } = this.props

    return <div className={styles.contributor}>
      <Image circle className={styles.photo} src={contributor.photo.preview} />
      <br />
      <br />
      <div className={styles.name}>
        {contributor.name}
      </div>
      <DropdownButton id={index} block title={'Options'}>
        <MenuItem eventKey='1' onClick={this._deleteSelf}>
          Remove Contributor
        </MenuItem>
      </DropdownButton>
      <br />
      <br />
    </div>
  }

  _deleteSelf = () => {
    this.props.deleteIndex(this.props.index)
  }
}
