import React from 'react';
import DefaultPage from './defaultpageclient';
import AssistanView from '../interaction/assistantChatContainer';
import Notifications from '../notification/notifications';
import BookmarkList from '../bookmarks/bookmarkList';
import LogOut from '../logout/logout.jsx';
export default class LeftMenuContent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        switch (this.props.sidebarItemSelected) {
            case 'Home':
            case 'Build':
                {
                    let domain = this.props.domain;
                    let dataSource;
                    let image;
                    switch (domain) {
                        case 'react':
                            dataSource = 'wordings_react.json';
                            image = 'reactlogo.png';
                            break;
                        case 'design pattern':
                            dataSource = 'wordings_design_pattern.json';
                            image = 'design.png';
                            break;
                        default:
                            break;
                    }
                    return <DefaultPage dataSource={dataSource} image={image}/>;
                }
            case 'ChatBot':
                {
                    return <AssistanView/>;
                }

            case 'Bookmarks':
                {
                    return <BookmarkList/>;
                }
            case 'notifications':
                {
                    return <Notifications/>;
                }
            case 'LogOut':
                {
                    return <LogOut/>
                }
        }
    }
}
