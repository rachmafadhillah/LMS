import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

const UpdateRequirement = ({showRequirement,handleClose,requirementData,setRequirements,requirements}) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

        const onSubmit = async (data) => {
        setLoading(true)
        await fetch(`${apiUrl}/requirements/${requirementData.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false)
                if (result.status == 200) {
                    const updatedRequirements = requirements.map(requirement => requirement.id == result.data.id 
                        ? {...requirement, text: result.data.text} : requirement)
                    setRequirements(updatedRequirements)
                    toast.success(result.message)
                } else {
                    console.log("Something went wrong")
                }
            });
    }

    useEffect(() => {
            if(requirementData) {
                reset({
                    requirement: requirementData.text
                })
            }
        },[requirementData]);
    

    return (
        <>
            <Modal size='lg' show={showRequirement} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Requirement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label htmlFor="" className='form-label'>
                                Requirement
                            </label>
                            <input
                                {
                                ...register('requirement', {
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
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            disabled={loading}
                            className='btn btn-primary'>
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default UpdateRequirement