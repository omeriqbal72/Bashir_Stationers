import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminOrderTabs from './AdminOrderTabs';
import AdminManageOrder from './AdminManageOrder';
import '../../css/admin/adminorderdivision.css'

const AdminOrdersDivision = () => {
    const { orderId } = useParams(); 
    const [selectedOrderId, setSelectedOrderId] = useState(orderId || null);

    useEffect(() => {
        setSelectedOrderId(orderId);
    }, [orderId]);

    const handleOrderChange = (id) => {
        setSelectedOrderId(id);
    };

    return (
        <div className="admin-orders-division">
            <div className="admin-orders-tabs">
                <AdminOrderTabs onOrderChange={handleOrderChange} />
            </div>
            <div className="admin-manage-orders-division">
                {selectedOrderId ? (
                    <AdminManageOrder id={selectedOrderId} />
                ) : (
                    <div className="admin-manage-orders-division-empty"><h3>No order selected. Please select an order from the tabs.</h3></div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersDivision;
