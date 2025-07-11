import { useState, useEffect } from "react";
import CardContainer from "../../ui/CardContainer";
import { SearchInput } from "../../common/SearchInput";
import { SortButton } from "../../common/SortButton";
import { ExportButton } from "../../common/ExportButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsChatLeftDots } from "react-icons/bs";
import bank from "../../../assets/images/sync/bank-logo.svg";
import Avatars from "../../heroUI/Avatars";
import { useProjectsData } from "../../../hooks/sync/projects/useProjectsData";
import { ProjectStatus } from "../../../types/sync";
import { Pagination } from "../../common/Pagination";
import { ProjectStatusLabels } from "../../../constants/syncstatuslabels";
import { exportToCSV } from "../../../utils/exportToCSV";
import formatDated from "../../../utils/formatDate";
import LoadingSpinner from "../../ui/LoadingSpinner";

const ProjectsTable = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: response,
    isLoading,
    isError,
  } = useProjectsData({
    page,
    limit,
    search: debouncedSearch,
    sortBy: `${sortConfig.key}:${sortConfig.direction.toUpperCase()}`,
  });

  const projects = response?.data?.data || [];
  const totalPages = response?.data?.meta?.totalPages || 1;

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusStyles = (status: ProjectStatus) => {
    switch (status) {
      case "CLOSED":
        return "bg-green-100 text-green-500";
      case "IN PROGRESS":
        return "bg-yellow-100 text-yellow-600";
      case "DRAFT":
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const handleExport = () => {
    const exportData = projects.map((project) => ({
      Project: project.name,
      Owner: `${project.owner?.firstName ?? ""} ${
        project.owner?.lastName ?? ""
      }`,
      Email: project.owner?.email ?? "",
      CreatedAt: formatDated(project.createdAt),
      Status:
        ProjectStatusLabels[project.status as ProjectStatus] ?? project.status,
      chat: project.owner.email,
    }));

    exportToCSV(exportData, "Projects_List");
  };

  if (isLoading) return <div><LoadingSpinner /></div>;
  if (isError) return <div>Error loading projects</div>;

  return (
    <CardContainer className="">
      {/* Search & Buttons */}
      <div className="flex justify-between mb-4">
        <SearchInput
          placeholder="Search milestones, projects..."
          value={searchInput}
          onChange={setSearchInput}
        />
        <div className="flex gap-3">
          <SortButton onClick={() => requestSort("title")} />
          <ExportButton onClick={handleExport} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-primary text-white text-[13px] text-start font-normal">
            <tr>
              <th
                className="py-3 px-3 text-start cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Project{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-5 text-start cursor-pointer"
                onClick={() => requestSort("owner.firstName")}
              >
                Project Owner{" "}
                {sortConfig.key === "owner.firstName" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-5 text-start cursor-pointer"
                onClick={() => requestSort("createdAt")}
              >
                Date{" "}
                {sortConfig.key === "createdAt" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-5 text-start">Members</th>
              <th
                className="px-5 text-start cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-5 text-start">Chat</th>
              <th className="px-5 text-start"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b">
                <td className="py-2 px-3 text-gray-600 text-[13px] font-semibold">
                  <div className="flex items-center gap-2">
                    <img src={bank} alt="bank logo" className="w-6 h-6" />
                    <span>{project.name}</span>
                  </div>
                </td>

                <td className="py-2 px-5 text-gray-600 text-[13px] font-semibold">
                  {project.owner?.firstName} {project.owner?.lastName}
                </td>

                <td className="py-2 px-5 text-gray-600 text-[13px] font-semibold">
                  {formatDate(project.createdAt)}
                </td>

                <td className="py-2 px-5 text-gray-600 text-[13px] font-semibold">
                  <Avatars />
                </td>

                <td className="py-2 px-5 text-[7px] font-semibold">
                  <div
                    className={`flex justify-center px-3 py-1.5 text-[10px] flex-row rounded-[23px] text-sm whitespace-nowrap ${getStatusStyles(
                      project.status
                    )}`}
                  >
                    {ProjectStatusLabels[project.status as ProjectStatus] ??
                      project.status}
                  </div>
                </td>

                <td className="py-2 px-5 text-gray-600 text-[13px] font-semibold">
                  <div className="flex items-center gap-1">
                    <BsChatLeftDots className="text-primary" />
                    <span>{project.owner?.email}</span>
                  </div>
                </td>

                <td className="py-2 px-5 text-center">
                  <RiDeleteBin6Line className="text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </CardContainer>
  );
};

export default ProjectsTable;
