import React from 'react';
import SetUpBot from '../buildAi/setUpBot';
import UserTable from '../users/userTable';
import Analytics from '../Analytics/info';
import Broadcast from '../broadcast/broadcast';
import TrainBot from '../trainbot/trainbot';
import AddConcept from '../manageConcept/addConcepts';
import RenameConcept from '../manageConcept/rename';
import UnansweredQueries from '../unansweredqueries/unansweredqueries';
import Graph from '../views/htmlGraph';

export default class Content extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        switch (this.props.sidebarItemSelected) {
            case 'SetupAi':
                {
                    return <SetUpBot/>;
                }
            case 'BroadCast':
                {
                    return <Broadcast/>;
                }
            case 'Users':
                {
                    return <UserTable/>;
                }
            case 'Analyze':
                {
                    return <Analytics/>;
                }
            case 'TrainBot':
                {
                    return <TrainBot/>;
                }
            case 'Unanswered Queries':
                {
                    return <UnansweredQueries/>;
                }
            case 'Add Concept':
                {
                    return <AddConcept/>;
                }
            case 'Rename Concept':
                {
                    return <RenameConcept/>;
                }
            case 'Test Graph':
                {
                    return <Graph/>;
                }
        }
    }
}
