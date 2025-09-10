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
        if (onSave) {
            await onSave(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Edit Parking Spot</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        placeholder="Name"
                        required
                    />
                    {/* Type Dropdown */}
                    <select
                        name="type"
                        value={formData.type}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                        required
                    >
                        <option value="" disabled>
                            Select Parking Type
                        </option>
                        <option value="uncovered">uncovered</option>
                        <option value="multi-storey">multi-storey</option>
                        <option value="covered">covered</option>
                    </select>
                    <input
                        type="number"
                        name="totalSpots"
                        value={formData.totalSpots}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        placeholder="Total Spots"
                        required
                    />
                    <input
                        type="number"
                        name="hourlyPrice"
                        value={formData.hourlyPrice}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        placeholder="Hourly Price"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border rounded"
                        placeholder="Address"
                    />
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-400 text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
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
