import React from 'react';

function OrderItem(props) {
    console.log(props.item);

    return (
        <>
            <div className='pItem row d-flex align-items-center m-1 p-2 border border-1 rounded-3 position-relative'>
                <div className='col-3 p-0'>
                    <img className='img-fluid rounded-2' src={props.item.images[0]}></img>
                </div>
                <div className='col-9 text-lg-start' key={props.item.id}>
                    <h5 className='my-1'>{props.item.item}</h5>
                    {props.item.cat == "Pizza"? 
                    <>
                    <h6 className='text-secondary m-0'>{props.item.var}</h6>
                    <h6 className='text-secondary m-0'>Sauce: {props.item.sauce}</h6>
                    <h6 className='text-secondary m-0'>Veggies: {props.item.veggies}</h6>
                    </>: null}
                    <h5 className='text-success my-1'>Rs. {props.price}</h5>
                </div>
                <div className='pItemBtns position-absolute end-0 w-auto bottom-0'>
                    <h4 className='m-0 mb-2'>0{props.item.items}</h4>
                </div>
            </div>
        </>
    );
}

export default OrderItem