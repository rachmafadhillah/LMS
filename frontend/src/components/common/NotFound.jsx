import React from 'react'

const NotFound = ({text}) => {
    return (
        <div className='col-12'>
            <div className='card shadow border-0 py-5 text-center'>
                <h4>{text ? text : 'Records not found'}</h4>
                <p>We couldn't any matching records. Please adjust your search or filters and try again.</p>
            </div>
        </div>
    )
}

export default NotFound