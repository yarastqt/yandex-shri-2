class LectureForm extends React.Component {
    static defaultProps = {
        options: {
            schools: [],
            audiences: []
        }
    };

    state = {
        name: '',
        schools: [],
        lecturers: [],
        audience: '',
        startTime: '',
        endTime: '',
        fields: {
            schools: [0],
            lecturers: [0]
        }
    };

    componentDidMount() {
        if (this.props.data) {
            this.setState({
                ...this.props.data,
                fields: {
                    schools: fillArray(this.props.data.schools.length),
                    lecturers: fillArray(this.props.data.lecturers.length)
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!objectsEquals(this.props.data, nextProps.data)) {
            this.setState({ ...nextProps.data });
        }
    }

    handleChange = (index) => ({ target }) => {
        if (index >= 0) {
            const nextValues = this.state[target.name].slice();
            nextValues[index] = target.value;

            this.setState({ [target.name]: nextValues });
        } else {
            this.setState({ [target.name]: target.value });
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.handleSubmit(this.state);
    };

    addField = (field) => () => {
        const fields = this.state.fields[field];
        const nextID = fields[fields.length - 1] + 1;

        this.setState({
            fields: {
                ...this.state.fields,
                [field]: [...fields, nextID]
            }
        });
    };

    removeField = (field, fieldID) => () => {
        const fields = this.state.fields[field].slice();
        const values = this.state[field].slice();

        this.setState({
            [field]: values.filter((v, index) => index !== fieldID),
            fields: {
                ...this.state.fields,
                [field]: fields.filter((index) => index !== fieldID)
            }
        });
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
                <div className="form__group">
                    { this.state.fields.schools.map((fieldID) => (
                        <div className="form__field" key={ fieldID }>
                            <Select
                                label="Школа"
                                name="schools"
                                value={ this.state.schools[fieldID] || '' }
                                onChange={ this.handleChange(fieldID) }
                                errors={ this.props.errors }
                                options={ this.props.options.schools }
                            />
                            { fieldID > 0 ? (
                                <div className="form__field-action">
                                    <button className="button" type="button" onClick={ this.removeField('schools', fieldID) }>
                                        <span className="button__in">
                                            <i className="icon icon_minus"></i>
                                        </span>
                                    </button>
                                </div>
                            ) : (
                                <div className="form__field-action">
                                    <button className="button" type="button" onClick={ this.addField('schools') }>
                                        <span className="button__in">
                                            <i className="icon icon_plus"></i>
                                        </span>
                                    </button>
                                </div>
                            ) }
                        </div>
                    )) }
                </div>
                <div className="form__group">
                    { this.state.fields.lecturers.map((fieldID) => (
                        <div className="form__field" key={ fieldID }>
                            <Input
                                label="Лектор"
                                name="lecturers"
                                value={ this.state.lecturers[fieldID] || '' }
                                onChange={ this.handleChange(fieldID) }
                                errors={ this.props.errors }
                            />
                            { fieldID > 0 ? (
                                <div className="form__field-action">
                                    <button className="button" type="button" onClick={ this.removeField('lecturers', fieldID) }>
                                        <span className="button__in">
                                            <i className="icon icon_minus"></i>
                                        </span>
                                    </button>
                                </div>
                            ) : (
                                <div className="form__field-action">
                                    <button className="button" type="button" onClick={ this.addField('lecturers') }>
                                        <span className="button__in">
                                            <i className="icon icon_plus"></i>
                                        </span>
                                    </button>
                                </div>
                            ) }
                        </div>
                    )) }
                </div>
                <div className="form__field">
                    <Select
                        label="Аудитория"
                        name="audience"
                        value={ this.state.audience }
                        onChange={ this.handleChange() }
                        errors={ this.props.errors }
                        options={ this.props.options.audiences }
                    />
                </div>
                <div className="form__field">
                    <Input
                        label="Начало лекции"
                        name="startTime"
                        placeholder="MM-DD-YYYY HH:mm"
                        value={ this.state.startTime }
                        onChange={ this.handleChange() }
                        errors={ this.props.errors }
                    />
                </div>
                <div className="form__field">
                    <Input
                        label="Конец лекции"
                        name="endTime"
                        placeholder="MM-DD-YYYY HH:mm"
                        value={ this.state.endTime }
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

class CreateLectureForm extends React.Component {
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
            <LectureForm
                handleSubmit={ this.handleSubmit }
                errors={ this.state.errors }
                options={ this.props.options }
                title="Добавить лекцию"
                buttonText="Добавить"
            />
        );
    }
}

class UpdateLectureForm extends React.Component {
    state = {
        errors: {}
    };

    handleSubmit = (data) => {
        this.props.update(data).catch(({ errors }) => {
            this.setState({ errors: normalizeErrors(errors) });
        });
    };

    render() {
        return (
            <LectureForm
                handleSubmit={ this.handleSubmit }
                errors={ this.state.errors }
                options={ this.props.options }
                data={ this.props.data }
                title="Редактировать лекцию"
                buttonText="Обновить"
            />
        );
    }
}

const Lecture = ({ id, name, schools, lecturers, audience, startTime, endTime, remove, select }) => (
    <div className="list__item">
        <div className="list__item-props">
            <div className="list__item-prop list__item-prop_name">
                { name }
            </div>
            <div className="list__item-prop">
                <i className="icon icon_school"></i>
                <span className="list__item-prop-text">
                    { schools.length ? schools.map((school, index) => (
                        <span key={ school.id }>{ school.name }{ schools.length - 1 !== index && ", " }</span>
                    )) : 'Неизвестно' }
                </span>
            </div>
            <div className="list__item-prop">
                <i className="icon icon_person"></i>
                <span className="list__item-prop-text">
                    { lecturers.map((lecturer, index) => (
                        <span key={ lecturer }>{ lecturer }{ lecturers.length - 1 !== index && ", " }</span>
                    )) }
                </span>
            </div>
            <div className="list__item-prop">
                <i className="icon icon_location"></i>
                <span className="list__item-prop-text">
                    { audience ? audience.name : 'Неизвестно' }
                </span>
            </div>
            <div className="list__item-prop list__item-prop_date">
                <i className="icon icon_time"></i>
                <span className="list__item-prop-text">
                    { normalizeDate(startTime) }
                </span>
            </div>
            <div className="list__item-prop list__item-prop_date">
                <i className="icon icon_time"></i>
                <span className="list__item-prop-text">
                    { normalizeDate(endTime) }
                </span>
            </div>
        </div>
        <ItemActions remove={ remove(id) } select={ select(id) } />
    </div>
);

class LecturesContainer extends React.Component {
    state = {
        title: 'Лекции',
        lecturesAPIEndpoint: null,
        selected: null,
        fetching: false,
        list: [],
        sideBar: {
            visible: false,
            kind: null
        },
        options: {
            schools: [],
            audiences: []
        },
        filters: {
            start: null,
            end: null
        }
    };

    componentWillMount() {
        this.setState({ fetching: true });
    }

    componentDidMount() {
        document.addEventListener('keyup', this.hideSideBarOnEsc);
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.setState({ fetching: true });
            http.get('/api/v1/lectures').then((list) => {
                this.setState({
                    list,
                    title: 'Лекции',
                    fetching: false
                });
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.hideSideBarOnEsc);
    }

    componentDidUpdate() {
        const { start, end } = this.state.filters;
        const { target, targetID } = this.props.match.params;

        if (target && targetID) {
            http.get(this.state.lecturesAPIEndpoint, { start, end }).then((list) => {
                if (!objectsEquals(list, this.state.list)) {
                    this.setState({ list });
                }
            });
        }
    }

    fetchData = () => {
        let lecturesAPIEndpoint = null;
        const { target, targetID } = this.props.match.params;

        if (target) {
            if (target === 'school') {
                lecturesAPIEndpoint = `/api/v1/schools/${targetID}/lectures`;
            } else if (target === 'audience') {
                lecturesAPIEndpoint = `/api/v1/audiences/${targetID}/lectures`;
            }
        } else {
            lecturesAPIEndpoint = '/api/v1/lectures';
        }

        Promise.all([
            http.get(lecturesAPIEndpoint),
            http.get('/api/v1/schools'),
            http.get('/api/v1/audiences')
        ]).then(([lectures, schools, audiences]) => {
            let title = this.state.title;

            if (target === 'school') {
                const { name } = schools.filter(({ id }) => id === targetID)[0];
                title += ` (${name})`;
            } else if (target === 'audience') {
                const { name } = audiences.filter(({ id }) => id === targetID)[0];
                title += ` (Аудитория ${name})`;
            }

            this.setState({
                title,
                lecturesAPIEndpoint,
                fetching: false,
                list: lectures,
                options: {
                    schools,
                    audiences
                }
            });
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

    changeFilter = ({ target }) => {
        this.setState({
            filters: {
                ...this.state.filters,
                [target.name]: target.value
            }
        });
    };

    select = (itemID) => () => {
        this.showSideBar('update')();

        const select = this.state.list.filter((item) => item.id === itemID)[0];
        const normalizedSelect = normalizeSelect(select);

        this.setState({
            selected: normalizedSelect
        });
    };

    create = (itemData) => {
        return http.post('/api/v1/lectures', itemData).then((data) => {
            this.hideSideBar();
            this.setState({ list: [...this.state.list, data] });
            this.props.pushToast('Лекция успешно создана');
        });
    };

    update = (itemData) => {
        return http.put(`/api/v1/lectures/${itemData.id}`, itemData).then((data) => {
            this.hideSideBar();
            this.setState({
                selected: null,
                list: this.state.list.map((item) => item.id === data.id ? data : item)
            });
            this.props.pushToast('Лекция успешно обновлена');
        });
    };

    remove = (itemID) => () => {
        if (confirm('Вы действительно хотите удалить лекцию?')) {
            http.delete(`/api/v1/lectures/${itemID}`).then((data) => {
                this.setState({
                    list: this.state.list.filter((item) => item.id !== data.id)
                });
                this.props.pushToast('Лекция успешно удалена');
            });
        }
    };

    render() {
        const { match } = this.props;
        const { title, fetching, list, sideBar, selected, options } = this.state;

        return (
            <Content header={ title } onClick={ this.showSideBar('create') } actionText="Добавить лекцию">
                { match.params.target && match.params.targetID && (
                    <div className="filters">
                        <div className="filters__item">
                            <Input
                                type="date"
                                label="Начальная дата"
                                name="start"
                                placeholder="MM-DD-YYYY"
                                onChange={ this.changeFilter }
                                value={ this.state.filters.start }
                                active
                            />
                        </div>
                        <div className="filters__item">
                            <Input
                                type="date"
                                label="Конечная дата"
                                name="end"
                                placeholder="MM-DD-YYYY"
                                onChange={ this.changeFilter }
                                value={ this.state.filters.end }
                                active
                            />
                        </div>
                    </div>
                ) }
                <Loader fetching={ fetching } isEmpty={ !list.length } >
                    <List
                        list={ list }
                        render={ (item) => (
                            <Lecture key={ item.id } remove={ this.remove } select={ this.select } { ...item } />
                        ) }
                    />
                </Loader>
                <div className={ sideBar.visible ? 'sidebar sidebar_visible' : 'sidebar' }>
                    <div className="sidebar__container">
                        { sideBar.kind === 'create' && (
                            <CreateLectureForm create={ this.create } options={ options } />
                        ) }
                        { sideBar.kind === 'update' && selected && (
                            <UpdateLectureForm update={ this.update } options={ options } data={ selected } />
                        ) }
                    </div>
                    <div className="sidebar__overlay" onClick={ this.hideSideBar }></div>
                </div>
            </Content>
        );
    }
}
