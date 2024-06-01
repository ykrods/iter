let _showSidebar = $state(true);

export function showSidebarState() {
  return {
    get value() { return _showSidebar },
    set value(v) { _showSidebar = v },
    toggle() { _showSidebar = !_showSidebar },
  };
}
