import React from 'react'
import { Carousel, Button, Glyphicon, Image,
  DropdownButton, MenuItem } from 'react-bootstrap'

import { chunkArray } from 'utils/helpers.js'
import InviteContributorModal from './inviteContributorModal'
import { getContributors, deleteContributors } from 'utils/api.js'
import styles from './app.cssm'

const pageSize = 6 // 6 contributors per page

export default class App extends React.PureComponent {
  state = {
    loading: false,
    noMore: false,
    contributors: [],
    carouselIndex: 0,
    carouselDirection: null
  }
  modalRef = React.createRef()
  componentDidMount = () => {
    this._getContributors()
    // pre-fetch the next two sets of contributors
    this._getContributors(pageSize)
    this._getContributors(pageSize * 2)
  }
  render = () => {
    const { contributors, carouselIndex, carouselDirection } = this.state

    return <div className={styles.center}>
      <h2>Contributors</h2>
      <br />
      <br />
      {contributors.length > 0 && <Carousel wrap={false}
        activeIndex={carouselIndex} direction={carouselDirection}
        onSelect={this._carouselSelect}>
        {chunkArray(contributors, pageSize).map(this._renderChunk)}
      </Carousel>}
      <br />
      <br />
      <Button bsStyle='success' onClick={this._openModal}>
        <Glyphicon glyph='plus' /> Invite a Contributor
      </Button>
      <InviteContributorModal ref={this.modalRef}
        afterSubmit={this._addContributor} />
      <br />
      <br />
    </div>
  }
  _renderChunk = (chunk, outerIndex) => {
    // photo URIs should be unique
    const aggregateKey = chunk.reduce((acc, contributor) => {
      return acc + ' ' + contributor.path
    }, '')
    const chunkIndex = outerIndex * pageSize
    return <Carousel.Item key={aggregateKey}>
      {chunk.map((contributor, innerIndex) => {
        return <Contributor key={contributor.path}
          contributor={contributor}
          index={chunkIndex + innerIndex}
          deleteIndex={this._deleteContributor} />
      })}
    </Carousel.Item>
  }

  _carouselSelect = async (carouselIndex, {direction}) => {
    this.setState({carouselIndex, carouselDirection: direction})

    // don't prefetch if not moving to the next to last page
    if (direction !== 'next') { return }
    const length = this.state.contributors.length
    const nextToLastPageIndex = getLastPageIndex(length) - 1
    if (carouselIndex < nextToLastPageIndex) { return }

    // pre-fetch the next set of contributors
    this._getContributors(length)
  }
  // this is done imperatively similar to a route change
  _openModal = () => {
    this.modalRef.current.open()
  }

  _getContributors = async (offset) => {
    if (this.state.noMore) { return } // don't overfetch

    const nextContributors = (await getContributors(offset)).contributors
    this.setState(({contributors}) => ({
      contributors: contributors.concat(nextContributors),
      noMore: nextContributors.length < pageSize
    }))
  }
  _addContributor = ({name, path}) => {
    // wait for pagination if still more, as it may not necessarily be next
    if (!this.state.noMore) { return }

    this.setState(({contributors}) => ({contributors: contributors.concat({
      name,
      path
    })}))
  }
  _deleteContributor = async (index) => {
    if (this.state.loading) { return } // debounce
    this.setState({loading: true})
    await deleteContributors(this.state.contributors[index].path)

    this.setState(({contributors, carouselIndex}) => ({
      contributors: [
        ...contributors.slice(0, index),
        ...contributors.slice(index + 1)
      ],
      loading: false,
      ...isEmptyState(index, carouselIndex, contributors.length)
    }))
  }
}

function isEmptyState (index, carouselIndex, length) {
  if (isEmptyPage(index, carouselIndex, length)) {
    /* this is a hack I had to look through the source code to find...
      without setting it to null or without completely disabling animations,
      the carousel will glitch out as its internal state (seems to be due to
      `previousActiveIndex`) will not update properly and it will disappear
      from the screen
      Setting the index to index - 1 does _not_ work
      Note that temporarily disabling animations doesn't work either, as the
      internal state still won't update and it will glitch out and disappear
      again as soon as the animations are re-enabled */
    return {carouselIndex: null}
  }
  return {}
}

// this is a bit of a monstrous computation
function isEmptyPage (index, carouselIndex, length) {
  const isLastPage = carouselIndex === getLastPageIndex(length)
  const isLastOnPage = (index % pageSize) === 0
  const isLast = (index + 1) === length
  return isLastPage && isLastOnPage && isLast
}

function getLastPageIndex (length) {
  return Math.ceil(length / pageSize) - 1
}

class Contributor extends React.PureComponent {
  render = () => {
    const { contributor, index } = this.props

    return <div className={styles.contributor}>
      <Image circle className={styles.photo} src={`/${contributor.path}`} />
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
