import React from 'react';
import {
  ArrowLeft,
  Eye,
  MousePointerClick,
  Wallet,
  Megaphone,
  TrendingUp,
  CalendarDays,
} from 'lucide-react';
import '../csscomponents/AdvertiserDashboard.css';

const demoCampaigns = [
  {
    id: 1,
    name: 'Pet Nutrition Awareness',
    format: 'Sponsored feed post',
    budget: 12000,
    spent: 7800,
    impressions: 12450,
    clicks: 420,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Veterinary Product Launch',
    format: 'Product announcement',
    budget: 18000,
    spent: 9200,
    impressions: 8100,
    clicks: 265,
    status: 'Under review',
  },
  {
    id: 3,
    name: 'Animal Health Webinar',
    format: 'Event promotion',
    budget: 8000,
    spent: 8000,
    impressions: 4300,
    clicks: 190,
    status: 'Completed',
  },
];

const weeklyData = [
  { day: 'Mon', value: 38 },
  { day: 'Tue', value: 58 },
  { day: 'Wed', value: 44 },
  { day: 'Thu', value: 75 },
  { day: 'Fri', value: 60 },
  { day: 'Sat', value: 88 },
  { day: 'Sun', value: 68 },
];

function formatCurrency(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function AdvertiserDashboard({ onBack }) {
  const totalBudget = demoCampaigns.reduce(
    (sum, campaign) => sum + campaign.budget,
    0
  );

  const totalSpent = demoCampaigns.reduce(
    (sum, campaign) => sum + campaign.spent,
    0
  );

  const totalImpressions = demoCampaigns.reduce(
    (sum, campaign) => sum + campaign.impressions,
    0
  );

  const totalClicks = demoCampaigns.reduce(
    (sum, campaign) => sum + campaign.clicks,
    0
  );

  const activeCampaigns = demoCampaigns.filter(
    (campaign) => campaign.status === 'Active'
  ).length;

  return (
    <section className="advertiser-dashboard">
      <div className="ad-dashboard-topline">
        <div>
          <span className="ad-dashboard-eyebrow">
            ZENVE VET / ADVERTISING
          </span>
          <h1>Advertiser Dashboard</h1>
          <p>Monitor campaign activity and review your advertising performance.</p>
        </div>

        <button
          type="button"
          className="ad-dashboard-back"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to Advertise
        </button>
      </div>

      <div className="ad-demo-notice">
        <Megaphone size={18} />
        <div>
          <strong>Demo dashboard</strong>
          <p>
            All figures and campaign records are sample data.
            Live advertiser information will be connected when the backend API is ready.
          </p>
        </div>
      </div>

      <div className="ad-dashboard-welcome">
        <div>
          <span>CAMPAIGN OVERVIEW</span>
          <h2>Your campaigns, at a glance.</h2>
          <p>Review your sample campaign activity and budget allocation.</p>
        </div>
        <div className="ad-dashboard-date">
          <CalendarDays size={17} />
          Demo reporting period
        </div>
      </div>

      <div className="ad-dashboard-metrics">
        <article className="ad-dashboard-metric">
          <div className="ad-metric-icon"><Megaphone size={20} /></div>
          <span>Total campaigns</span>
          <strong>{demoCampaigns.length}</strong>
          <small>{activeCampaigns} active campaign</small>
        </article>

        <article className="ad-dashboard-metric">
          <div className="ad-metric-icon"><Eye size={20} /></div>
          <span>Total impressions</span>
          <strong>{totalImpressions.toLocaleString('en-IN')}</strong>
          <small>Across demo campaigns</small>
        </article>

        <article className="ad-dashboard-metric">
          <div className="ad-metric-icon"><MousePointerClick size={20} /></div>
          <span>Total clicks</span>
          <strong>{totalClicks.toLocaleString('en-IN')}</strong>
          <small>Sample engagement data</small>
        </article>

        <article className="ad-dashboard-metric">
          <div className="ad-metric-icon"><Wallet size={20} /></div>
          <span>Budget spent</span>
          <strong>{formatCurrency(totalSpent)}</strong>
          <small>Of {formatCurrency(totalBudget)} sample budget</small>
        </article>
      </div>

      <div className="ad-dashboard-content-grid">
        <section className="ad-dashboard-card">
          <div className="ad-dashboard-card-heading">
            <div>
              <h3>Weekly campaign activity</h3>
              <p>Illustrative engagement trend</p>
            </div>
            <TrendingUp size={20} />
          </div>

          <div className="ad-demo-chart" role="img" aria-label="Illustrative weekly campaign activity bar chart">
            {weeklyData.map((item) => (
              <div className="ad-chart-column" key={item.day}>
                <div className="ad-chart-track">
                  <div
                    className="ad-chart-bar"
                    style={{ height: `${item.value}%` }}
                    title={`${item.day}: ${item.value} demo units`}
                  />
                </div>
                <span>{item.day}</span>
              </div>
            ))}
          </div>
          <p className="ad-chart-footnote">
            Demo units only; these are not live analytics.
          </p>
        </section>

        <section className="ad-dashboard-card ad-budget-card">
          <div className="ad-dashboard-card-heading">
            <div>
              <h3>Budget allocation</h3>
              <p>Combined demo campaign budgets</p>
            </div>
            <Wallet size={20} />
          </div>

          <strong className="ad-budget-total">{formatCurrency(totalSpent)}</strong>
          <p className="ad-budget-caption">
            Sample amount spent out of {formatCurrency(totalBudget)}
          </p>

          <div className="ad-budget-progress">
            <span
              style={{
                width: `${totalBudget ? (totalSpent / totalBudget) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="ad-budget-legend">
            <span>Spent</span>
            <strong>{Math.round((totalSpent / totalBudget) * 100)}%</strong>
          </div>
          <div className="ad-budget-legend">
            <span>Remaining</span>
            <strong>{formatCurrency(totalBudget - totalSpent)}</strong>
          </div>
        </section>
      </div>

      <section className="ad-dashboard-card ad-campaigns-card">
        <div className="ad-dashboard-card-heading">
          <div>
            <h3>Campaign records</h3>
            <p>Sample campaigns for the dashboard preview</p>
          </div>
          <span className="ad-demo-count">{demoCampaigns.length} demo records</span>
        </div>

        <div className="ad-campaign-table-wrap">
          <table className="ad-campaign-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>Budget</th>
                <th>Spent</th>
              </tr>
            </thead>
            <tbody>
              {demoCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>
                    <strong>{campaign.name}</strong>
                    <span>{campaign.format}</span>
                  </td>
                  <td>
                    <span
                      className={`ad-campaign-status ad-status-${campaign.status
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td>{campaign.impressions.toLocaleString('en-IN')}</td>
                  <td>{campaign.clicks.toLocaleString('en-IN')}</td>
                  <td>{formatCurrency(campaign.budget)}</td>
                  <td>{formatCurrency(campaign.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}