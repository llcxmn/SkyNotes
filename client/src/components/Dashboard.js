import React from 'react';
import Recently from './Recently';
import ContentLayout from './ContentLayout';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('lastViewed');

  return (
    <ContentLayout
      title="Recently"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortBy={sortBy}
      setSortBy={setSortBy}
    >
      <Recently searchTerm={searchTerm} sortBy={sortBy} />
    </ContentLayout>
  );
};

export default Dashboard;
