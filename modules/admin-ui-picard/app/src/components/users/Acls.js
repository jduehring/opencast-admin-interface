import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import MainNav from "../shared/MainNav";
import Link from "react-router-dom/Link";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import NewResourceModal from "../shared/NewResourceModal";
import {aclsTemplateMap} from "../../configs/tableConfigs/aclsTableConfig";
import {fetchFilters} from "../../thunks/tableFilterThunks";
import {fetchUsers} from "../../thunks/userThunks";
import {loadAclsIntoTable, loadGroupsIntoTable, loadUsersIntoTable} from "../../thunks/tableThunks";
import {fetchGroups} from "../../thunks/groupThunks";
import {fetchAcls} from "../../thunks/aclThunks";
import {getTotalAcls} from "../../selectors/aclSelectors";
import {editTextFilter} from "../../actions/tableFilterActions";
import {setOffset} from "../../actions/tableActions";
import {styleNavClosed, styleNavOpen} from "../../utils/componentsUtils";
import {logger} from "../../utils/logger";

/**
 * This component renders the table view of acls
 */
const Acls = ({ loadingAcls, loadingAclsIntoTable, acls, loadingFilters,
                    loadingUsers, loadingUsersIntoTable, loadingGroups,
                    loadingGroupsIntoTable, resetTextFilter, resetOffset }) => {
    const { t } = useTranslation();
    const [displayNavigation, setNavigation] = useState(false);
    const [displayNewAclModal, setNewAclModal] = useState(false);

    const loadAcls = async () => {
        // Fetching acls from server
        await loadingAcls();

        // Load acls into table
        loadingAclsIntoTable();
    };

    const loadUsers = () => {
        // Reset the current page to first page
        resetOffset();

        // Fetching users from server
        loadingUsers();

        // Load users into table
        loadingUsersIntoTable();
    };

    const loadGroups = () => {
        // Reset the current page to first page
        resetOffset();

        // Fetching groups from server
        loadingGroups();

        // Load groups into table
        loadingGroupsIntoTable();
    };

    useEffect(() => {
        resetTextFilter();

        // Load acls on mount
        loadAcls().then(r => logger.info(r));

        // Load filters
        loadingFilters('acls');

        // Fetch ACLs every minute
        let fetchAclInterval = setInterval(loadAcls, 100000);

        return () => clearInterval(fetchAclInterval);

    }, []);

    const toggleNavigation = () => {
        setNavigation(!displayNavigation);
    };

    const showNewAclModal = () => {
        setNewAclModal(true);
    }

    const hideNewAclModal = () => {
        setNewAclModal(false);
    }

    return (
        <>
            <section className="action-nav-bar">

                {/* Add acl button */}
                <div className="btn-group">
                    {/*todo: implement onClick and with role*/}
                    <button className="add" onClick={() => showNewAclModal()}>
                        <i className="fa fa-plus"/>
                        <span>{t('USERS.ACTIONS.ADD_ACL')}</span>
                    </button>
                </div>

                {/* Display modal for new acl if add acl button is clicked */}
                <NewResourceModal showModal={displayNewAclModal}
                                  handleClose={hideNewAclModal}
                                  resource="acl"/>

                {/* Include Burger-button menu*/}
                <MainNav isOpen={displayNavigation}
                         toggleMenu={toggleNavigation} />

                <nav>
                    {/*todo: with role*/}
                    <Link to="/users/users"
                          className={cn({active: false})}
                          onClick={() => loadUsers()}>
                        {t('USERS.NAVIGATION.USERS')}
                    </Link>
                    <Link to="/users/groups"
                          className={cn({active: false})}
                          onClick={() => loadGroups()}>
                        {t('USERS.NAVIGATION.GROUPS')}
                    </Link>
                    <Link to="/users/acls"
                          className={cn({active: true})}
                          onClick={() => loadAcls()}>
                        {t('USERS.NAVIGATION.PERMISSIONS')}
                    </Link>
                </nav>
            </section>

            <div className="main-view" style={displayNavigation ? styleNavOpen : styleNavClosed}>
                {/* Include notifications component */}
                <Notifications />

                <div  className="controls-container">
                    {/* Include filters component */}
                    <TableFilters loadResource={loadingAcls}
                                  loadResourceIntoTable={loadingAclsIntoTable}
                                  resource={'acls'}/>
                    <h1>{t('USERS.ACLS.TABLE.CAPTION')}</h1>
                    <h4>{t('TABLE_SUMMARY', { numberOfRows: acls })}</h4>
                </div>
                {/* Include table component */}
                <Table templateMap={aclsTemplateMap} />
            </div>
        </>
    );
};

// Getting state data out of redux store
const mapStateToProps = state => ({
    acls: getTotalAcls(state)
});

// Mapping actions to dispatch
const mapDispatchToProps = dispatch => ({
    loadingFilters: resource => dispatch(fetchFilters(resource)),
    loadingAcls: () => dispatch(fetchAcls()),
    loadingAclsIntoTable: () => dispatch(loadAclsIntoTable()),
    loadingUsers: () => dispatch(fetchUsers()),
    loadingUsersIntoTable: () => dispatch(loadUsersIntoTable()),
    loadingGroups: () => dispatch(fetchGroups()),
    loadingGroupsIntoTable: () => dispatch(loadGroupsIntoTable()),
    resetTextFilter: () => dispatch(editTextFilter('')),
    resetOffset: () => dispatch(setOffset(0))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Acls));