import React from 'react'
import { Image, DropdownButton, MenuItem } from 'react-bootstrap'

import styles from './contributor.cssm'

export default class Contributor extends React.PureComponent {
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
