import Icon from "../common/Icon";

function Topbar({ activeItem }) {
  return <header className="app-topbar"><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{activeItem}</strong></div><div className="topbar-actions"><button className="icon-button" type="button" aria-label="Search"><Icon name="search" /></button><button className="icon-button notification" type="button" aria-label="Notifications"><Icon name="bell" /><i /></button><span className="topbar-divider" /><span className="user-avatar">AS</span><span className="user-name">Ananya Sharma</span><span className="chevron">⌄</span></div></header>;
}

export default Topbar;
