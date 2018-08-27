import React from 'react'
import { Carousel, Button, Glyphicon, Image } from 'react-bootstrap'

import styles from './app.cssm'

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
        {contributors.map(this._renderContributor)}
      </Carousel>}
      <br />
      <br />
      <Button bsStyle='success' onClick={this._addContributor}>
        <Glyphicon glyph='plus' /> Invite a Contributor
      </Button>
    </div>
  }
  _renderContributor = (contributor) => {
    // photo URIs should be unique
    return <Carousel.Item key={contributor.photo}>
      <Contributor contributor={contributor} />
    </Carousel.Item>
  }

  _addContributor = () => {
    const random = Math.random()
    this.setState(({contributors}) => ({contributors: contributors.concat({
      name: 'John Doe ' + random,
      // bust cache on photos
      photo: 'https://source.unsplash.com/random/100x100?sig=' + random
    })}))
  }
}

class Contributor extends React.PureComponent {
  render = () => {
    const { contributor } = this.props

    return <div>
      <Image circle src={contributor.photo} />
      <br />
      <br />
      <div>{contributor.name}</div>
    </div>
  }
}
