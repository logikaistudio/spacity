import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    initialBranches,
    initialServices,
    initialTherapists,
    sampleBookings,
    initialInventory
} from '../data/initialData';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // Load from localStorage or use initial data
    const [branches] = useState(() => {
        const saved = localStorage.getItem('spacity_branches');
        return saved ? JSON.parse(saved) : initialBranches;
    });

    const [selectedBranchId, setSelectedBranchId] = useState(() => {
        const saved = localStorage.getItem('spacity_selected_branch');
        return saved || branches[0]?.id;
    });

    const [services, setServices] = useState(() => {
        const saved = localStorage.getItem('spacity_services');
        return saved ? JSON.parse(saved) : initialServices;
    });

    const [therapists] = useState(() => {
        const saved = localStorage.getItem('spacity_therapists');
        return saved ? JSON.parse(saved) : initialTherapists;
    });

    const [bookings, setBookings] = useState(() => {
        const saved = localStorage.getItem('spacity_bookings');
        return saved ? JSON.parse(saved) : sampleBookings;
    });

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('spacity_inventory');
        return saved ? JSON.parse(saved) : initialInventory;
    });

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('spacity_branches', JSON.stringify(branches));
    }, [branches]);

    useEffect(() => {
        localStorage.setItem('spacity_selected_branch', selectedBranchId);
    }, [selectedBranchId]);

    useEffect(() => {
        localStorage.setItem('spacity_services', JSON.stringify(services));
    }, [services]);

    useEffect(() => {
        localStorage.setItem('spacity_therapists', JSON.stringify(therapists));
    }, [therapists]);

    useEffect(() => {
        localStorage.setItem('spacity_bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('spacity_inventory', JSON.stringify(inventory));
    }, [inventory]);

    // Get current branch
    const selectedBranch = branches.find(b => b.id === selectedBranchId);

    // Filter bookings by selected branch
    const branchBookings = bookings.filter(b => b.branchId === selectedBranchId);

    // Service management
    const addService = (service) => {
        const newService = {
            ...service,
            id: `svc-${Date.now()}`,
            isActive: true
        };
        setServices([...services, newService]);
        return newService;
    };

    const updateService = (id, updates) => {
        setServices(services.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const deleteService = (id) => {
        setServices(services.filter(s => s.id !== id));
    };

    // Booking management
    const addBooking = (booking) => {
        const newBooking = {
            ...booking,
            id: `bk-${Date.now()}`,
            branchId: selectedBranchId
        };
        setBookings([...bookings, newBooking]);
        return newBooking;
    };

    const updateBooking = (id, updates) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const deleteBooking = (id) => {
        setBookings(bookings.filter(b => b.id !== id));
    };

    // Inventory management
    const addInventoryItem = (item) => {
        const newItem = {
            ...item,
            id: `inv-${Date.now()}`
        };
        setInventory([...inventory, newItem]);
        return newItem;
    };

    const updateInventoryItem = (id, updates) => {
        setInventory(inventory.map(i => i.id === id ? { ...i, ...updates } : i));
    };

    const deleteInventoryItem = (id) => {
        setInventory(inventory.filter(i => i.id !== id));
    };

    const value = {
        // Branch
        branches,
        selectedBranchId,
        setSelectedBranchId,
        selectedBranch,

        // Services
        services,
        addService,
        updateService,
        deleteService,

        // Therapists
        therapists,

        // Bookings
        bookings,
        branchBookings,
        addBooking,
        updateBooking,
        deleteBooking,

        // Inventory
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
