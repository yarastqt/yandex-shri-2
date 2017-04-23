class Application extends React.Component {
    state = {
        toast: {
            visible: false,
            text: null
        }
    };

    pushToast = (text) => {
        this.setState({ toast: { visible: true, text } });
        this.toastTimeout && clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(this.hideToast, 2000);
    };

    hideToast = () => {
        this.setState({ toast: { visible: false, text: null } });
    };

    render() {
        return (
            <BrowserRouter>
                <div className="main">
                    <Header />
                    <div className="viewport viewport_overflow">
                        <Switch>
                            <Redirect exact from="/" to="/schools" />
                            <Route exact path="/schools" render={ () => (
                                <SchoolsContainer pushToast={ this.pushToast } />
                            ) } />
                            <Route exact path="/audiences" render={ () => (
                                <AudiencesContainer pushToast={ this.pushToast } />
                            ) } />
                            <Route exact path="/lectures" render={ (routeProps) => (
                                <LecturesContainer pushToast={ this.pushToast } { ...routeProps } />
                            ) } />
                            <Route exact path="/lectures/:target/:targetID" render={ (routeProps) => (
                                <LecturesContainer pushToast={ this.pushToast } { ...routeProps } />
                            ) } />
                            <Route component={ NoMatchRoute } />
                        </Switch>
                        <div className="footer">
                            <div className="footer__in">
                                <div className="footer__copyright">Проект «Мобилизация» &copy; 2017</div>
                            </div>
                        </div>
                    </div>
                    <SnackBar toast={ this.state.toast } />
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(
    <Application />,
    document.getElementById('react-root')
);
