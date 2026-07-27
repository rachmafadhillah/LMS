import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ReactPlayer from 'react-player';

const FreePreview = ({show, handleClose,freeLesson}) => {
  return (
    <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{freeLesson.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ReactPlayer
                width='100%'
                height='100%'
                controls
                config={{
                    file: {
                        attributes: {
                            controlsList: 'nodownload'
                        }
                    }
                }}
                src={freeLesson.video_url}
            />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>          
        </Modal.Footer>
      </Modal>
  )
}

export default FreePreview