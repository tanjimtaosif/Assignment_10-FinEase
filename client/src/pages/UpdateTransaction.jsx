import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axiosConfig";
import toast from "react-hot-toast";

export default function UpdateTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                // TODO: replace with real API
                const res = await api.get(`/api/transactions/${id}`);
                setForm({
                    type: res.data.type,
                    category: res.data.category,
                    amount: res.data.amount,
                    description: res.data.description,
                    date: res.data.date?.slice(0, 10),
                });
            } catch {
                toast.error("Failed to load transaction");
            }
        })();
    }, [id]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/api/transactions/${id}`, {
                ...form,
                amount: Number(form.amount),
            });
            toast.success("Updated!");
            navigate(`/transaction/${id}`);
        } catch {
            toast.error("Update failed");
        }
    };

    if (!form)
        return (
            <div className="grid place-items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <h1 className="text-2xl font-bold">Update Transaction</h1>

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="form-control">
                            <label className="label">Type</label>
                            <select name="type" className="select select-bordered" value={form.type} onChange={onChange}>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">Category</label>
                            <input name="category" className="input input-bordered" value={form.category} onChange={onChange} />
                        </div>

                        <div className="form-control">
                            <label className="label">Amount</label>
                            <input name="amount" type="number" className="input input-bordered" value={form.amount} onChange={onChange} />
                        </div>

                        <div className="form-control">
                            <label className="label">Date</label>
                            <input name="date" type="date" className="input input-bordered" value={form.date} onChange={onChange} />
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label">Description</label>
                            <textarea name="description" className="textarea textarea-bordered" rows={3} value={form.description} onChange={onChange} />
                        </div>

                        <div className="md:col-span-2">
                            <button className="btn btn-primary w-full">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
