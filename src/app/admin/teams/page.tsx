 const AdminTeamManagement = () => {
        const { data: teamsData, loading, error, fetchData } = useAdminTeams();
        const [searchTerm, setSearchTerm] = useState('');
        const [currentPage, setCurrentPage] = useState(1);

        const handleSearch = (term: string) => {
            setSearchTerm(term);
            setCurrentPage(1);
            fetchData({ search: term, page: 1 });
        };

        const handleDeleteTeam = async (teamId: string) => {
            if (confirm('Are you sure you want to delete this team?')) {
                try {
                    await apiCall(`/api/admin/teams/${teamId}`, { method: 'DELETE' });
                    fetchData({ search: searchTerm, page: currentPage });
                } catch (error) {
                    console.error('Delete team error:', error);
                }
            }
        };

        if (loading) {
            return (
                <div className="p-6 flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-yellow-400" />
                    <span className="ml-2 text-white">Loading teams...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
                        Error loading teams: {error}
                    </div>
                </div>
            );
        }

        const teams = teamsData?.teams || [];
        const pagination = teamsData?.pagination;

        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Team Management</h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search teams..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Completed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submissions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {teams.map((team: any) => (
                                    <tr key={team.id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{team.name}</div>
                                            <div className="text-sm text-gray-400">{team.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-yellow-400 font-semibold">{team.points}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-white">{team.challengesCompleted}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-white">{team.totalSubmissions}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-400">{new Date(team.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeleteTeam(team.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pagination && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-400">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} teams
                        </div>
                        <div className="flex space-x-2">
                            {pagination.page > 1 && (
                                <button
                                    onClick={() => {
                                        setCurrentPage(pagination.page - 1);
                                        fetchData({ search: searchTerm, page: pagination.page - 1 });
                                    }}
                                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                                >
                                    Previous
                                </button>
                            )}
                            {pagination.page < pagination.totalPages && (
                                <button
                                    onClick={() => {
                                        setCurrentPage(pagination.page + 1);
                                        fetchData({ search: searchTerm, page: pagination.page + 1 });
                                    }}
                                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };