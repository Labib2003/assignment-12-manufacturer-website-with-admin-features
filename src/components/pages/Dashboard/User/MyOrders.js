import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import auth from '../../../../firebase.init';
import FailedToFetch from '../../../shared/FailedToFetch';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import DeleteConfirmModal from './DeleteConfirmModal';
import OrdersRow from './OrdersRow';

const MyOrders = () => {
    // user info
    const [user] = useAuthState(auth);
    const email = user.email;
    const navigate = useNavigate();

    const [order, setOrder] = useState({});

    // react query
    const { isLoading, error, data: orders, refetch } = useQuery('orders', () =>
        fetch(`https://tools-manufacturer.herokuapp.com/orders/${email}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then(res => {
            if (res.status === 401 || res.status === 403) {
                signOut(auth);
                localStorage.removeItem('accessToken');
                navigate('/login');
            }
            return res.json()
        }
        )
    );
    if (isLoading) {
        return <LoadingSpinner></LoadingSpinner>
    };
    if (error) {
        return <FailedToFetch></FailedToFetch>
    };

    return (
        <div className='card shadow-xl'>
            <div className="overflow-x-auto card-body">
                <h1 className='text-3xl font-bold mb-10'>Your orders</h1>
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className='text-left text-xl font-bold'>
                            <th></th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Payment Status</th>
                            <th className='text-center'>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order, index) => <OrdersRow
                                key={order._id}
                                order={order}
                                index={index}
                                setOrder={setOrder}
                            ></OrdersRow>)
                        }
                    </tbody>
                </table>
                {order && <DeleteConfirmModal
                    order={order}
                    setOrder={setOrder}
                    refetch={refetch}
                ></DeleteConfirmModal>}
            </div>
        </div>
    );
};

export default MyOrders;