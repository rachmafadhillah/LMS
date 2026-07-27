import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { apiUrl, token } from '../../../common/Config';
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import UpdateRequirement from './UpdateRequirement';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageRequirement = () => {
    const [loading, setLoading] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [requirementData, setRequirementData] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const params = useParams();

    const [showRequirement, setShowRequirement] = useState(false);
    const handleClose = () => setShowRequirement(false);
    const handleShow = (requirement) => {
        setShowRequirement(true);
        setRequirementData(requirement)
    }

    const onSubmit = async (data) => {
        setLoading(true)
        const formData = { ...data, course_id: params.id }

        await fetch(`${apiUrl}/requirements`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false)
                if (result.status == 200) {
                    const newRequirements = [...requirements, result.data]
                    setRequirements(newRequirements)
                    toast.success(result.message)
                    reset();
                } else {
                    console.log("Something went wrong")
                }
            });
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(requirements);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setRequirements(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updatedRequirements) => {
        await fetch(`${apiUrl}/sort-requirements`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({requirements: updatedRequirements})
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    toast.success(result.message)
                } else {
                    console.log("Something went wrong")
                }
            });
    }

    const fecthRequirements = async (data) => {
        const formData = { ...data, course_id: params.id }

        await fetch(`${apiUrl}/requirements?course_id=${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setRequirements(result.data);
                } else {
                    console.log("Something went wrong")
                }
            });
    }

    const deleteRequirement = async (id) => {
        if (confirm("Are you sure you want to delete?")) {
            await fetch(`${apiUrl}/requirements/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(res => res.json())
                .then(result => {
                    setLoading(false)
                    if (result.status == 200) {
                        const newRequirements = requirements.filter(requirement => requirement.id != id)
                        setRequirements(newRequirements)
                        toast.success(result.message)
                    } else {
                        console.log("Something went wrong")
                    }
                });
        }
    }

    useEffect(() => {
        fecthRequirements();
    }, [])

    return (
        <>
            <div className="card shadow-lg border-0 mt-4">
                <div className="card-body p-4">
                    <div className="d-flex">
                        <h4 className='h5 mb-3'>Requirement</h4>
                    </div>
                    <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <input
                                {
                                ...register("requirement", {
                                    required: "The requirement field is required."
                                })

                                }
                                type="text"
                                className={`form-control ${errors.requirement && 'is-invalid'}`}
                                placeholder='Requirement'
                            />
                            {
                                errors.requirement && <p className='invalid-feedback'>{errors.requirement.message}</p>
                            }
                        </div>
                        <button
                            disabled={loading}
                            className='btn btn-primary'>
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </form>

                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        requirements.map((requirement, index) => (
                                            <Draggable key={requirement.id} draggableId={`${requirement.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                                                    >
                                                        <div className="card-body p-2 d-flex">
                                                            <div><MdDragIndicator /></div>
                                                            <div className="d-flex justify-content-between w-100">
                                                                <div className='ps-2'>
                                                                    {requirement.text}
                                                                </div>
                                                                <div className='d-flex'>
                                                                    <Link onClick={() => handleShow(requirement)} className='text-primary me-1'>
                                                                        <BsPencilSquare />
                                                                    </Link>
                                                                    <Link onClick={() => deleteRequirement(requirement.id)} className='text-danger'>
                                                                        <FaTrashAlt />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
            <UpdateRequirement
                showRequirement={showRequirement}
                requirements={requirements}
                setRequirements={setRequirements}
                requirementData={requirementData}
                handleClose={handleClose}
            />
        </>
    )
}

export default ManageRequirement