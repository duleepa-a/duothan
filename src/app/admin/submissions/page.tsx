 const AdminSubmissions = () => {
        const { data: submissionsData, loading, error, fetchData } = useAdminSubmissions();
        const [statusFilter, setStatusFilter] = useState('all');
        const [typeFilter, setTypeFilter] = useState('all');

        const handleUpdateSubmission = async (submissionId: string, isCorrect: boolean) => {
            try {
                await apiCall(`/api/admin/submissions/${submissionId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ isCorrect })
                });
                fetchData();
            } catch (error) {
                console.error('Update submission error:', error);
            }
        };

        const handleFilterChange = (status: string, type: string) => {
            setStatusFilter(status);
            setTypeFilter(type);
            
            const params: any = {};
            if (status !== 'all') {
                params.status = status;
            }
            if (type !== 'all') {
                params.type = type;
            }
            
            fetchData(params);
        };

        if (loading) {
            return (
                <div className="p-6 flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-yellow-400" />
                    <span className="ml-2 text-white">Loading submissions...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
                        Error loading submissions: {error}
                    </div>
                </div>
            );
        }

        const submissions = submissionsData?.submissions || [];

        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Submissions</h1>
                    <div className="flex items-center space-x-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleFilterChange(e.target.value, typeFilter)}
                            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="correct">Accepted</option>
                            <option value="incorrect">Rejected</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => handleFilterChange(statusFilter, e.target.value)}
                            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="all">All Types</option>
                            <option value="ALGORITHMIC">Algorithmic</option>
                            <option value="BUILDATHON">Buildathon</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    {submissions.map((submission: any) => (
                        <div key={submission.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{submission.team?.name}</h3>
                                    <p className="text-gray-400">{submission.challenge?.title}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {submission.type.toLowerCase()} • {new Date(submission.submittedAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className={`px-3 py-1 rounded-full text-sm ${
                                        submission.isCorrect ? 'bg-green-500/20 text-green-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {submission.isCorrect ? 'accepted' : 'pending'}
                                    </div>
                                    {!submission.isCorrect && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleUpdateSubmission(submission.id, true)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleUpdateSubmission(submission.id, false)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Submission Content</h4>
                                {submission.type === 'ALGORITHMIC' ? (
                                    <pre className="text-sm text-gray-400 whitespace-pre-wrap overflow-x-auto">
                                        {submission.content}
                                    </pre>
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        <p>GitHub Link: <a href={submission.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{submission.githubLink}</a></p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 text-sm text-gray-400">
                                Points: <span className="text-yellow-400">{submission.challenge?.points || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };