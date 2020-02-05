import path from 'path'
import { i18n } from '../boot/i18n'
// import routes from './routes'

export const ticked = []
export function onlyOneShowingChild(children = [], dependent) {
  let onlyOneChild = null
  const showingChildren = children.filter(item => !item.hidden)

  // When there is only one child route, the child route is displayed by default
  if (showingChildren.length === 1) {
    onlyOneChild = showingChildren[0]
    onlyOneChild.path = path.resolve(dependent.path, onlyOneChild.path)
    return onlyOneChild
  }

  // Show dependent if there are no child route to display
  if (showingChildren.length === 0) {
    onlyOneChild = { ...dependent, path: '', noShowingChildren: true }
    return onlyOneChild
  }

  return false
}

export function Get(nodes, basePath = '/') {
  const res = []
  // this.ticked = []
  for (let node of nodes) {
    // skip some route
    if (node.hidden && node.constant) { continue }
    if (node.constant && ticked.indexOf(node.name) < 0) ticked.push(node.name)

    const onlyOneShowingChild = this.onlyOneShowingChild(node.children, node)
    if (node.children && onlyOneShowingChild && !node.alwaysShow) {
      node = onlyOneShowingChild
    }

    const data = {
      path: node.path, // path.resolve(basePath, route.path),
      label: i18n.t(`route.${node.label}`),
      name: node.name,
      icon: node.icon,
      disabled: node.disabled || false
    }
    // recursive child nodes
    if (node.children) {
      data.children = this.Get(node.children, data.path)
    }
    res.push(data)
    // if (route.constant) this.ticked.push(route.name)
  }
  return res
}

export function generateRoutes(nodes, dependent = null) {
  const rs = []
  try {
    const childrens = nodes.filter(x => x.dependent !== null)
    nodes.forEach(e => {
      if (e.dependent === dependent) {
        e.label = i18n.t(`route.${e.title}`)
        const child = generateRoutes(childrens, e._id.toString())
        if (child.length > 0) e.children = child
        rs.push(e)
      }
    })
  } catch (e) { console.log(e) }
  return rs
}

export function generateCategory(nodes, dependent = null) {
  const rs = []
  try {
    const childrens = nodes.filter(x => x.dependent !== null)
    nodes.forEach(e => {
      if (e.dependent === dependent) {
        e.label = e.meta && e.meta.label ? i18n.t(`category.${e.meta.label}`) : e.title
        e.ticked = false
        const child = generateCategory(childrens, e._id.toString())
        if (child.length > 0) e.children = child
        else e.children = []
        rs.push(e)
      }
    })
  } catch (e) { console.log(e) }
  return rs
}

export function findNode(nodes, nodeId, nodeKey = 'id') {
  let rs = []
  try {
    nodes.forEach(e => {
      if (nodeId.includes(e[nodeKey])) rs.push(e)
      if (e.children.length) {
        const child = findNode(e.children, nodeId, nodeKey)
        if (child.length) rs = [...rs, ...child]
      }
    })
  } catch (e) { console.log(e) }
  return rs
}

// export function getParent(root, id) {
//   return root.some(function(n) {
//     if (n.id === id) return n
//     if (n.children) return getParent(n.children, id)
//   }) || null
// }

// function getParent(root, id) {
//   var i, node
//   for (var i = 0; i < root.length; i++) {
//     node = root[i]
//     if (node.id === id || node.children && (node = getParent(node.children, id))) {
//       return node
//     }
//   }
//   return null
// }

// var mytree = [{ id: 245, parent: '0', title: 'project1', children: [{ id: 246, parent: '245', title: 'sub task 1' }] }, { id: 238, parent: '0', title: 'project2', children: [{ id: 240, parent: '238', title: 'sub task 2' }, { id: 242, parent: '238', title: 'sub task 3', children: [{ id: 241, parent: '242', title: 'sub task 3.1' }] }] }, { id: 173, parent: '0', title: 'project3' }]

// console.log(getParent(mytree, 238))
// // console.log(getParent(mytree, 241))
