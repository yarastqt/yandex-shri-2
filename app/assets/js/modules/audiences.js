class AudienceForm extends React.Component {
    state = {
        name: '',
        capacity: '',
        location: ''
    };

    componentDidMount() {
        if (this.props.data) {
            this.setState({ ...this.props.data });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!objectsEquals(this.props.data, nextProps.data)) {
            this.setState({ ...nextProps.data });
        }
    }

    reset = () => {
        this.setState({
            name: '',
            capacity: '',
            location: ''
        });
    };

    handleChange = () => ({ target }) => {
        this.setState({
            [target.name]: target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.handleSubmit(this.state);
    };

    render() {
        return (
            <form className="form" onSubmit={ this.handleSubmit } autoComplete="off">
                <div className="form__title">
                    { this.props.title }
                </div>
                <div className="form__field">
                    <Input
                        label="Название"
                        name="name"
                        value={ this.state.name }
                        onChange={ this.handleChange() }
                        errors={ this.props.errors }
                    />
                </div>
                <div className="form__field">
                    <Input
                        label="Вместимость"
                        name="capacity"
                        value={ this.state.capacity }
                        onChange={ this.handleChange() }
                        errors={ this.props.errors }
                    />
                </div>
                <div className="form__field">
                    <Input
                        label="Расположение"
                        name="location"
                        value={ this.state.location }
                        onChange={ this.handleChange() }
                        errors={ this.props.errors }
                    />
                </div>
                <div className="form__field">
                    <button className="button">
                        { this.props.buttonText }
                    </button>
                </div>
            </form>
        );
    }
}

class CreateAudienceForm extends React.Component {
    state = {
        errors: {}
    };

    handleSubmit = (data) => {
        this.props.create(data).catch(({ errors }) => {
            this.setState({ errors: normalizeErrors(errors) });
        });
    };

    render() {
        return (
            <AudienceForm
                handleSubmit={ this.handleSubmit }
                errors={ this.state.errors }
                title="Добавить аудиторию"
                buttonText="Добавить"
            />
        );
    }
}

class UpdateAudienceForm extends React.Component {
    state = {
        errors: {}
    };

    componentWillReceiveProps(nextProps) {
        if (!objectsEquals(this.props.data, nextProps)) {
            this.setState({ errors: {} });
        }
    }

    handleSubmit = (data) => {
        this.props.update(data).catch(({ errors }) => {
            this.setState({ errors: normalizeErrors(errors) });
        });
    };

    render() {
        return (
            <AudienceForm
                handleSubmit={ this.handleSubmit }
                errors={ this.state.errors }
                data={ this.props.data }
                title="Редактировать аудиторию"
                buttonText="Обновить"
            />
        );
    }
}

const Audience = ({ id, name, capacity, location, remove, select }) => (
    <div className="list__item">
        <div className="list__item-props">
            <div className="list__item-prop list__item-prop_name">
                { name }
            </div>
            <div className="list__item-prop">
                <i className="icon icon_people"></i>
                <span className="list__item-prop-text">
                    { capacity } { declineOfPeople(capacity) }
                </span>
            </div>
            <div className="list__item-prop">
                <i className="icon icon_location"></i>
                <span className="list__item-prop-text">
                    { location }
                </span>
            </div>
            <div className="list__item-prop list__item-prop_link">
                <Link className="list__item-link" to={ `/lectures/audience/${id}` }>
                    Расписание лекций
                </Link>
            </div>
        </div>
        <ItemActions remove={ remove(id) } select={ select(id) } />
    </div>
);

class AudiencesContainer extends React.Component {
    state = {
        selected: null,
        fetching: false,
        list: [],
        sideBar: {
            visible: false,
            kind: null
        }
    };

    componentWillMount() {
        this.setState({ fetching: true });
    }

    componentDidMount() {
        document.addEventListener('keyup', this.hideSideBarOnEsc);
        this.fetchData();
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.hideSideBarOnEsc);
    }

    fetchData = () => {
        http.get('/api/v1/audiences').then((data) => {
            this.setState({ fetching: false, list: data });
        });
    };

    showSideBar = (kind) => () => {
        this.setState({
            sideBar: {
                visible: true,
                kind
            }
        });
    };

    hideSideBar = () => {
        this.setState({
            sideBar: {
                visible: false,
                kind: null
            }
        });
    };

    hideSideBarOnEsc = (event) => {
        if (event.keyCode === 27) {
            this.hideSideBar();
        }
    };

    select = (itemID) => () => {
        this.showSideBar('update')();
        this.setState({
            selected: this.state.list.filter((item) => item.id === itemID)[0]
        });
    };

    create = (itemData) => {
        return http.post('/api/v1/audiences', itemData).then((data) => {
            this.hideSideBar();
            this.setState({ list: [...this.state.list, data] });
            this.props.pushToast('Аудитория успешно создана');
        });
    };

    update = (itemData) => {
        return http.put(`/api/v1/audiences/${itemData.id}`, itemData).then((data) => {
            this.hideSideBar();
            this.setState({
                selected: null,
                list: this.state.list.map((item) => item.id === data.id ? data : item)
            });
            this.props.pushToast('Аудитория успешно обновлена');
        });
    };

    remove = (itemID) => () => {
        if (confirm('Вы действительно хотите удалить аудиторию?')) {
            http.delete(`/api/v1/audiences/${itemID}`).then((data) => {
                this.setState({
                    list: this.state.list.filter((item) => item.id !== data.id)
                });
                this.props.pushToast('Аудитория успешно удалена');
            });
        }
    };

    render() {
        return (
            <Content header="Аудитории" onClick={ this.showSideBar('create') } actionText="Добавить аудиторию">
                <Loader fetching={ this.state.fetching } isEmpty={ !this.state.list.length } >
                    <List
                        list={ this.state.list }
                        render={ (item) => (
                            <Audience key={ item.id } remove={ this.remove } select={ this.select } { ...item } />
                        ) }
                    />
                </Loader>
                <div className={ this.state.sideBar.visible ? 'sidebar sidebar_visible' : 'sidebar' }>
                    <div className="sidebar__container">
                        { this.state.sideBar.kind === 'create' && (
                            <CreateAudienceForm create={ this.create } />
                        ) }
                        { this.state.sideBar.kind === 'update' && this.state.selected && (
                            <UpdateAudienceForm update={ this.update } data={ this.state.selected } />
                        ) }
                    </div>
                    <div className="sidebar__overlay" onClick={ this.hideSideBar }></div>
                </div>
            </Content>
        );
    }
}
