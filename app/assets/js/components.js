const { BrowserRouter, Switch, Redirect, Route, Link, NavLink } = ReactRouterDOM;

const HeaderNavLink = ({ to, name }) => (
    <NavLink className="header__menu-link" activeClassName="header__menu-link_active" to={ to } exact>
        { name }
    </NavLink>
);

const Header = () => (
    <div className="header">
        <div className="header__in">
            <Link to="/" className="header__link">
                <div className="header__logo"></div>
            </Link>
            <div className="header__menu">
                <HeaderNavLink to="/schools" name="Школы" />
                <HeaderNavLink to="/audiences" name="Аудитории" />
                <HeaderNavLink to="/lectures" name="Лекции" />
            </div>
        </div>
    </div>
);

const InputError = ({ error }) => (
    <span className="input-error">{ error && error.message }</span>
);

const Input = ({ label, errors = {}, active = false, ...input }) => (
    <div className="input">
        <label className="label">
            <span className="label__text">{ label }</span>
            <input
                type="text"
                className={ active && input.value ? 'input__control input__control_active' : 'input__control' }
                { ...input }
            />
            <InputError error={ errors[input.name] } />
        </label>
    </div>
);

const Select = ({ label, options, errors, ...input }) => (
    <div className="select">
        <label className="label">
            <span className="label__text">{ label }</span>
            <select className="select__control" { ...input }>
                <option value=""></option>
                { options.map((option) => (
                    <option value={ option.id } key={ option.id }>{ option.name }</option>
                )) }
            </select>
            <InputError error={ errors[input.name] } />
        </label>
    </div>
);

const Content = ({ header, onClick, actionText, children }) => (
    <div className="content">
        <div className="content__in">
            <div className="content__heading">
                <h1 className="content__header">
                    { header }
                </h1>
                <div className="content__actions">
                    <button type="button" className="button" onClick={ onClick }>
                        { actionText }
                    </button>
                </div>
            </div>
            { children }
        </div>
    </div>
);

const ItemActions = ({ remove, select }) => (
    <div className="list__item-actions">
        <button className="list__item-action" type="button" onClick={ select }>
            <i className="icon icon_edit"></i>
        </button>
        <button className="list__item-action" type="button" onClick={ remove }>
            <i className="icon icon_remove"></i>
        </button>
    </div>
);

const Message = ({ text }) => (
    <div className="message">
        <div className="message__text">{ text }</div>
    </div>
);

const Loader = ({ fetching, isEmpty, children }) => {
    if (fetching) {
        return (
            <Message text="Загрузка..." />
        );
    } else if (isEmpty) {
        return (
            <Message text="Список пуст" />
        );
    }

    return children;
};

const List = ({ list, render }) => {
    return (
        <div className="list">
            { list.map((item) => render(item)) }
        </div>
    );
};

const SnackBar = ({ toast }) => (
    <div className={ toast.visible ? 'snackbar snackbar_visible' : 'snackbar' }>
        <div className={ toast.visible ? 'toast toast_visible' : 'toast' }>
            <div className="toast__text">{ toast.text }</div>
        </div>
    </div>
);

const NoMatchRoute = () => (
    <Message text="Ой! Страница не найдена" />
);
