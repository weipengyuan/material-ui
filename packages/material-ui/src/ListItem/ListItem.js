import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentPropType } from '@material-ui/utils';
import withStyles from '../styles/withStyles';
import ButtonBase from '../ButtonBase';
import { isMuiElement } from '../utils/reactHelpers';
import MergeListContext from './MergeListContext';

export const styles = theme => ({
  /* Styles applied to the (normally root) `component` element. May be wrapped by a `container`. */
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    textDecoration: 'none',
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'left',
    paddingTop: 11, // To use 10px in v4.0.0
    paddingBottom: 11, // To use 10px in v4.0.0
    '&$selected, &$selected:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  /* Styles applied to the `container` element if `children` includes `ListItemSecondaryAction`. */
  container: {
    position: 'relative',
  },
  // TODO: Sanity check this - why is focusVisibleClassName prop apparently applied to a div?
  /* Styles applied to the `component`'s `focusVisibleClassName` property if `button={true}`. */
  focusVisible: {
    backgroundColor: theme.palette.action.hover,
  },
  /* Legacy styles applied to the root element. Use `root` instead. */
  default: {},
  /* Styles applied to the `component` element if `dense={true}` or `children` includes `Avatar`. */
  dense: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  /* Styles applied to the `component` element if `alignItems="flex-start"`. */
  alignItemsFlexStart: {
    alignItems: 'flex-start',
  },
  /* Styles applied to the inner `component` element if `disabled={true}`. */
  disabled: {
    opacity: 0.5,
  },
  /* Styles applied to the inner `component` element if `divider={true}`. */
  divider: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundClip: 'padding-box',
  },
  /* Styles applied to the inner `component` element if `disableGutters={false}`. */
  gutters: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  /* Styles applied to the inner `component` element if `button={true}`. */
  button: {
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: theme.palette.action.hover,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
  /* Styles applied to the `component` element if `children` includes `ListItemSecondaryAction`. */
  secondaryAction: {
    // Add some space to avoid collision as `ListItemSecondaryAction`
    // is absolutely positionned.
    paddingRight: 32,
  },
  /* Styles applied to the root element if `selected={true}`. */
  selected: {},
});

function ListItem(props) {
  const {
    alignItems,
    button,
    children: childrenProp,
    classes,
    className: classNameProp,
    component: componentProp,
    ContainerComponent,
    ContainerProps: { className: ContainerClassName, ...ContainerProps } = {},
    dense: denseProp,
    disabled,
    disableGutters,
    divider,
    focusVisibleClassName,
    selected,
    ...other
  } = props;

  return (
    <MergeListContext dense={denseProp} alignItems={alignItems}>
      {({ dense }) => {
        const children = React.Children.toArray(childrenProp);
        const hasAvatar = children.some(value => isMuiElement(value, ['ListItemAvatar']));
        const hasSecondaryAction =
          children.length &&
          isMuiElement(children[children.length - 1], ['ListItemSecondaryAction']);

        const className = classNames(
          classes.root,
          classes.default,
          {
            [classes.dense]: dense || hasAvatar,
            [classes.gutters]: !disableGutters,
            [classes.divider]: divider,
            [classes.disabled]: disabled,
            [classes.button]: button,
            [classes.alignItemsFlexStart]: alignItems === 'flex-start',
            [classes.secondaryAction]: hasSecondaryAction,
            [classes.selected]: selected,
          },
          classNameProp,
        );

        const componentProps = { className, disabled, ...other };
        let Component = componentProp || 'li';

        if (button) {
          componentProps.component = componentProp || 'div';
          componentProps.focusVisibleClassName = classNames(
            classes.focusVisible,
            focusVisibleClassName,
          );
          Component = ButtonBase;
        }

        if (hasSecondaryAction) {
          // Use div by default.
          Component = !componentProps.component && !componentProp ? 'div' : Component;

          // Avoid nesting of li > li.
          if (ContainerComponent === 'li') {
            if (Component === 'li') {
              Component = 'div';
            } else if (componentProps.component === 'li') {
              componentProps.component = 'div';
            }
          }

          return (
            <ContainerComponent
              className={classNames(classes.container, ContainerClassName)}
              {...ContainerProps}
            >
              <Component {...componentProps}>{children}</Component>
              {children.pop()}
            </ContainerComponent>
          );
        }

        return <Component {...componentProps}>{children}</Component>;
      }}
    </MergeListContext>
  );
}

ListItem.propTypes = {
  /**
   * Defines the `align-items` style property.
   */
  alignItems: PropTypes.oneOf(['flex-start', 'center']),
  /**
   * If `true`, the list item will be a button (using `ButtonBase`).
   */
  button: PropTypes.bool,
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css-api) below for more details.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   * By default, it's a `li` when `button` is `false` and a `div` when `button` is `true`.
   */
  component: componentPropType,
  /**
   * The container component used when a `ListItemSecondaryAction` is rendered.
   */
  ContainerComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
  /**
   * Properties applied to the container element when the component
   * is used to display a `ListItemSecondaryAction`.
   */
  ContainerProps: PropTypes.object,
  /**
   * If `true`, compact vertical padding designed for keyboard and mouse input will be used.
   */
  dense: PropTypes.bool,
  /**
   * If `true`, the list item will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the left and right padding is removed.
   */
  disableGutters: PropTypes.bool,
  /**
   * If `true`, a 1px light border is added to the bottom of the list item.
   */
  divider: PropTypes.bool,
  /**
   * @ignore
   */
  focusVisibleClassName: PropTypes.string,
  /**
   * Use to apply selected styling.
   */
  selected: PropTypes.bool,
};

ListItem.defaultProps = {
  alignItems: 'center',
  button: false,
  ContainerComponent: 'li',
  dense: false,
  disabled: false,
  disableGutters: false,
  divider: false,
  selected: false,
};

export default withStyles(styles, { name: 'MuiListItem' })(ListItem);
