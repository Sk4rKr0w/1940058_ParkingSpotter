import { useState, useEffect } from "react";

const EditSpotModal = ({ isOpen, onClose, parking, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        totalSpots: "",
        hourlyPrice: "",
        address: "",
    });

    useEffect(() => {
        if (parking) {
            setFormData({
                name: parking.name || "",
                type: parking.type || "",
                totalSpots: parking.totalSpots || "",
                hourlyPrice: parking.hourlyPrice || "",
                address: parking.address || "",
            });
        }
    }, [parking]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (onSave) await onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-4">Edit Parking Spot</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium mb-1"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                            placeholder="Name"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="type"
                            className="block text-sm font-medium mb-1"
                        >
                            Parking Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                            required
                        >
                            <option value="" disabled>
                                Select Parking Type
                            </option>
                            <option value="uncovered">Uncovered</option>
                            <option value="multi-storey">Multi-storey</option>
                            <option value="covered">Covered</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="totalSpots"
                            className="block text-sm font-medium mb-1"
                        >
                            Total Spots
                        </label>
                        <input
                            id="totalSpots"
                            type="number"
                            name="totalSpots"
                            value={formData.totalSpots}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                            placeholder="Total Spots"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="hourlyPrice"
                            className="block text-sm font-medium mb-1"
                        >
                            Hourly Price
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                id="hourlyPrice"
                                type="number"
                                name="hourlyPrice"
                                value={formData.hourlyPrice}
                                onChange={handleChange}
                                className="w-full p-3 border rounded"
                                placeholder="Hourly Price"
                                required
                            />
                            <span>€/h</span>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="address"
                            className="block text-sm font-medium mb-1"
                        >
                            Address
                        </label>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                            placeholder="Address"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 bg-gray-400 hover:bg-gray-600 transition text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 transition text-white rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSpotModal;
