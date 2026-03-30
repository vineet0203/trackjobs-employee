import ListingCard from './ListingCard';

const Listings = ({ approvedListings, pendingListings, loading, error, selectedDate }) => {
  if (loading) {
    return <div className="employee-listings-loading">Loading listings...</div>;
  }

  if (error) {
    return <div className="employee-listings-error">{error}</div>;
  }

  return (
    <section className="employee-listings-wrap">
      <div className="employee-listings-head">
        <h2>Listings</h2>
        {selectedDate ? <p>Filtered by selected date</p> : <p>Showing all assigned listings</p>}
      </div>

      <div className="employee-listings-grid">
        <div className="employee-listing-column">
          <h3>Approved Listings</h3>
          {approvedListings.length === 0 ? (
            <p className="employee-listings-empty">No approved listings found.</p>
          ) : (
            <div className="employee-listing-stack">
              {approvedListings.map((listing) => (
                <ListingCard key={`approved-${listing.id}`} listing={listing} />
              ))}
            </div>
          )}
        </div>

        <div className="employee-listing-column">
          <h3>Pending Listings</h3>
          {pendingListings.length === 0 ? (
            <p className="employee-listings-empty">No pending listings found.</p>
          ) : (
            <div className="employee-listing-stack">
              {pendingListings.map((listing) => (
                <ListingCard key={`pending-${listing.id}`} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Listings;
