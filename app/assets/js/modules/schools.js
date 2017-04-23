class SchoolForm extends React.Component {
    state = {
        name: '',
        studentsCount: ''
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
            studentsCount: ''
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
                        label="Количество студентов"
                        name="studentsCount"
                        value={ this.state.studentsCount }
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

class CreateSchoolForm extends React.Component {
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
            <SchoolForm
                handleSubmit={ this.handleSubmit }
                errors={ this.state.errors }
                title="Добавить школу"
                buttonText="Добавить"
            />
        );
    }
}

class UpdateSchoolForm extends React.Component {
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
            <SchoolForm
                handleSubmit={ this.handleSubmit }
                errors={ this.state.errors }
                data={ this.props.data }
                title="Редактировать школу"
                buttonText="Обновить"
            />
        );
    }
}

const School = ({ id, name, studentsCount, remove, select }) => (
    <div className="list__item">
        <div className="list__item-props">
            <div className="list__item-prop list__item-prop_name">
                { name }
            </div>
            <div className="list__item-prop">
                <i className="icon icon_people"></i>
                <span className="list__item-prop-text">
                    { studentsCount } { declineOfPeople(studentsCount) }
                </span>
            </div>
            <div className="list__item-prop list__item-prop_link">
                <Link className="list__item-link" to={ `/lectures/school/${id}` }>
                    Расписание лекций
                </Link>
            </div>
        </div>
        <ItemActions remove={ remove(id) } select={ select(id) } />
    </div>
);

class SchoolsContainer extends React.Component {
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
        http.get('/api/v1/schools').then((data) => {
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

    select = (itemId) => () => {
        this.showSideBar('update')();
        this.setState({
            selected: this.state.list.filter((school) => school.id === itemId)[0]
        });
    };

    create = (itemData) => {
        return http.post('/api/v1/schools', itemData).then((data) => {
            this.hideSideBar();
            this.setState({
                list: [...this.state.list, data]
            });
            this.props.pushToast('Школа успешно создана');
        });
    };

    update = (itemData) => {
        return http.put(`/api/v1/schools/${itemData.id}`, itemData).then((data) => {
            this.hideSideBar();
            this.setState({
                selected: null,
                list: this.state.list.map((item) => item.id === data.id ? data : item)
            });
            this.props.pushToast('Школа успешно обновлена');
        });
    };

    remove = (itemId) => () => {
        if (confirm('Вы действительно хотите удалить школу?')) {
            http.delete(`/api/v1/schools/${itemId}`).then((data) => {
                this.setState({
                    list: this.state.list.filter((school) => school.id !== data.id)
                });
                this.props.pushToast('Школа успешно удалена');
            });
        }
    };

    render() {
        return (
            <Content header="Школы" onClick={ this.showSideBar('create') } actionText="Добавить школу">
                <Loader fetching={ this.state.fetching } isEmpty={ !this.state.list.length } >
                    <List
                        list={ this.state.list }
                        render={ (item) => (
                            <School key={ item.id } remove={ this.remove } select={ this.select } { ...item } />
                        ) }
                    />
                </Loader>
                <div className={ this.state.sideBar.visible ? 'sidebar sidebar_visible' : 'sidebar' }>
                    <div className="sidebar__container">
                        { this.state.sideBar.kind === 'create' && (
                            <CreateSchoolForm create={ this.create } />
                        ) }
                        { this.state.sideBar.kind === 'update' && this.state.selected && (
                            <UpdateSchoolForm update={ this.update } data={ this.state.selected } />
                        ) }
                    </div>
                    <div className="sidebar__overlay" onClick={ this.hideSideBar }></div>
                </div>
            </Content>
        );
    }
}
