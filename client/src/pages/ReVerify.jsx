import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import axios from 'axios';

export default function ReVerify() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8000/api/v1/user/reverify',
                { email },
                { withCredentials: true }
            );

            if (response.data.success) {
                setSuccess(true);
                setEmail('');
                // Show success message and redirect after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to send verification email. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-8 shadow-lg">
                <h1 className="text-2xl font-bold mb-2 text-center">Resend Verification Email</h1>
                <p className="text-gray-600 text-center mb-6">
                    Enter your email to receive a new verification link
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            ✓ Verification email sent successfully! Redirecting to login...
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
                    >
                        {loading ? 'Sending...' : 'Send Verification Email'}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">
                        Remember your password?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
}
