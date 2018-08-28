import React from 'react'
import { FormGroup, ControlLabel, Image, Glyphicon,
  Button } from 'react-bootstrap'
import DropZone from 'react-dropzone'

import styles from './photoInput.cssm'

const maxFileSize = 1 * 1024 * 1024 // 1mb

export default class PhotoInput extends React.PureComponent {
  render () {
    const { onDrop, photo } = this.props

    return <FormGroup>
      <ControlLabel>Photo</ControlLabel>
      <DropZone multiple={false} accept='image/jpeg'
        maxSize={maxFileSize} onDrop={onDrop}
        className={styles.dropZone}
        activeClassName={styles.activeDropZone}
        rejectClassName={styles.rejectDropZone}>
        <div className={styles.dragText}>
          Drag a photo here...
        </div>
        {photo
          ? <React.Fragment>
            <Image circle className={styles.photo} src={photo.preview} />
            <br />
          </React.Fragment>
          : <div className={styles.photo}>
            Placeholder...
            <Glyphicon glyph='picture' className={styles.glyph} />
          </div>}
        <Button bsStyle='primary'>
          <Glyphicon glyph='search' /> Or click to browse for one...
        </Button>
        <br />
        <small>Max file size 1mb</small>
      </DropZone>
    </FormGroup>
  }
}
