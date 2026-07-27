import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

const SortChapters = ({ showChapterSortModal, handleCloseChapterSortModal, course, setChapters, chapters }) => {

    const [chaptersData, setChaptersData] = useState([]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(chaptersData);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setChaptersData(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updatedChapters) => {
        await fetch(`${apiUrl}/sort-chapters`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ chapters: updatedChapters })
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setChapters({ type: "SET_CHAPTERS", payload: result.chapters })
                    toast.success(result.message)
                } else {
                    console.log("Something went wrong")
                }
            });
    }

    useEffect(() => {
        if (chapters) {
            setChaptersData(chapters)
        }
    }, [chapters])

    return (
        <>
            <Modal size='lg' show={showChapterSortModal} onHide={handleCloseChapterSortModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Sort Chapters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        chaptersData.map((chapter, index) => (
                                            <Draggable key={chapter.id} draggableId={`${chapter.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                                                    >
                                                        {chapter.title}

                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SortChapters