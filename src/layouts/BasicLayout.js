import React from 'react';
import { Layout, Menu, Icon, Tooltip, Avatar, Popover } from 'antd';
import DocumentTitle from 'react-document-title';
import { Link } from 'dva/router';
import styles from './BasicLayout.less';
import PageHeader from '../components/PageHeader/PageHeader';
import { menus } from '../common/nav';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function getDefaultCollapsedSubMenus() {
  return menus
    .filter(item => (item.children && item.defaultCollapsed))
    .map(item => item.key || item.path);
}

export default class BasicLayout extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline',
    openKeys: getDefaultCollapsedSubMenus(),
  };
  onOpenChange = (openKeys) => {
    this.setState({ openKeys });
  }
  getCurrentMenuSelectedKeys() {
    const { location: { pathname } } = this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [menus[0].key];
    }
    return keys;
  }
  getNavMenuItems(menusData, level = 0, parentPath = '') {
    const { collapsed } = this.state;
    return menusData.map((item) => {
      if (item.children) {
        return (
          <SubMenu
            title={
              <span>
                <Icon type={item.icon} />
                <span className={styles.navText}>{item.name}</span>
              </span>
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, level + 1, parentPath + item.path)}
          </SubMenu>
        );
      }
      const itemPath = `${parentPath}/${item.path}`.replace('//', '/');
      return (
        <Menu.Item key={item.key || item.path}>
          <Tooltip
            title={(level === 0 && collapsed) ? item.name : ''}
            placement="right"
            overlayStyle={{ paddingLeft: 16 }}
          >
            <Link to={itemPath}>
              <Icon type={item.icon} />
              <span className={level === 0 ? styles.navText : ''}>
                {item.name}
              </span>
            </Link>
          </Tooltip>
        </Menu.Item>
      );
    });
  }
  inlineOpenKeys = [];
  toggle = () => {
    const { collapsed } = this.state;
    const inlineOpenKeys = [...this.state.openKeys];
    this.setState({
      collapsed: !collapsed,
      mode: collapsed ? 'inline' : 'vertical',
      openKeys: collapsed ? this.inlineOpenKeys : [],
    });
    if (!collapsed) {
      this.inlineOpenKeys = inlineOpenKeys;
    }
  }
  render() {
    const { routes, params, children, header, main } = this.props;
    const { openKeys, collapsed } = this.state;
    const pageTitle = routes[routes.length - 1].breadcrumbName;

    return (
      <DocumentTitle title={`${pageTitle} - Ant Design Admin`}>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            style={{ minHeight: '100vh' }}
            width={272}
          >
            <div className={styles.logo}>
              <Link to="/">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/ElBVfakcgrgjarOUnuvx.svg" alt="logo" />
              </Link>
            </div>
            <Menu
              theme="dark"
              mode={this.state.mode}
              openKeys={openKeys}
              onOpenChange={this.onOpenChange}
              defaultSelectedKeys={this.getCurrentMenuSelectedKeys()}
            >
              {this.getNavMenuItems(menus)}
            </Menu>
          </Sider>
          <Layout>
            <Header className={styles.header}>
              <Tooltip
                placement="bottom"
                title={collapsed ? '展开菜单' : '收起菜单'}
                mouseLeaveDelay={0}
                transitionName=""
              >
                <Icon
                  className={styles.trigger}
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Tooltip>
              <div className={styles.right}>
                <Icon className={styles.action} type="search" />
                <Popover title="通知栏" content="内容">
                  <Icon className={styles.action} type="bell" />
                </Popover>
                <Avatar size="small" className={styles.avatar}>毛</Avatar>
                momo.zxy
              </div>
            </Header>
            <PageHeader title={pageTitle} routes={routes} params={params}>
              {header}
            </PageHeader>
            <Content style={{ margin: 24, minHeight: 280, overflow: 'visible' }}>
              {main || children}
            </Content>
          </Layout>
        </Layout>
      </DocumentTitle>
    );
  }
}
