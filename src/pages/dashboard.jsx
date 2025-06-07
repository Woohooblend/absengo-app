import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import Card from "../components/Card";
import LineChart from "../components/Charts/LineChart";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-6 bg-gray-100">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-4 flex items-center space-x-1">
            <nav className="text-sm text-gray-600 mb-4 flex items-center space-x-1">
              <span className="text-gray-400">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-400">Dashboard</span>
            </nav>
          </nav>

          {/* Page content */}
          <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            {/* Section wrapper */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Section - 1/3 */}
              <div className="basis-2/3">
                  {/* Responsive grid: 1 col on mobile, 3 cols on md+ */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Card 1">Content of card 1</Card>
                    <Card title="Card 2">Content of card 2</Card>
                    <Card title="Card 3">Content of card 3</Card>
                  </div>

                  {/* Full-width card below */}
                  <div className="mt-8">
                    <Card title="Full-width card" className="w-full">
                      <LineChart/>
                    </Card>
                  </div>
              </div>

              {/* Right Section - 2/3 */}
              <div className="basis-1/3">
                <Card title="Right Section">
                  This takes 2/3 of the width on desktop.
                </Card>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
