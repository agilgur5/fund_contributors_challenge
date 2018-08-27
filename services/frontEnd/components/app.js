import React from 'react'
import { Carousel, Button, Glyphicon, Image,
  DropdownButton, MenuItem } from 'react-bootstrap'

import { chunkArray } from 'utils/helpers.js'
import styles from './app.cssm'

const pageSize = 6 // 6 contributors per page

export default class App extends React.PureComponent {
  state = {
    contributors: []
  }
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
      <Button bsStyle='success' onClick={this._addContributor}>
        <Glyphicon glyph='plus' /> Invite a Contributor
      </Button>
      <br />
      <br />
    </div>
  }
  _renderChunk = (chunk) => {
    const aggregateKey = chunk.reduce((acc, contributor) => {
      return acc + ' ' + contributor.photo
    }, '')
    return <Carousel.Item key={aggregateKey}>
      {chunk.map(this._renderContributor)}
    </Carousel.Item>
  }
  _renderContributor = (contributor, index) => {
    // photo URIs should be unique
    return <Contributor key={contributor.photo} contributor={contributor}
      index={index} deleteIndex={this._deleteContributor} />
  }

  _addContributor = () => {
    const random = Math.random()
    this.setState(({contributors}) => ({contributors: contributors.concat({
      name: 'John Doe ' + random,
      // bust cache on photos
      photo: 'https://source.unsplash.com/random/100x100?sig=' + random
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
      <Image circle src={contributor.photo} />
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
