/**
 * Fork of an OSS MIT licensed npm module.
 * Infinite scroll was added, code was cleaned up, and onTouch callback added.
 * LICENSE and COPYRIGHT: http://bit.ly/2Hp0Lxn
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ListView,
  StyleSheet,
  View,
} from 'react-native'

import InfiniteScrollView from 'react-native-infinite-scroll-view'

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})

class ImageGrid extends Component {
  constructor() {
    super()

    this.state = {
      data: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    }

    this.renderRow = this.renderRow.bind(this)
  }

  buildRows(items, itemsPerRow = 3) {
    return items.reduce((rows, item, idx) => {
      // If a full row is filled create a new row array
      if (idx % itemsPerRow === 0 && idx > 0) rows.push([])
      rows[rows.length - 1].push(item)
      return rows
    }, [[]])
  }

  renderRow(items) {
    // Calculate the width of a single item based on the device width
    // and the desired margins between individual items
    const { itemsPerRow, itemMargin, deviceWidth } = this.props
    const totalMargin = itemMargin * (itemsPerRow - 1)
    const itemWidth = Math.floor((deviceWidth - totalMargin) / itemsPerRow)
    const adjustedMargin = (deviceWidth - (itemsPerRow * itemWidth)) / (itemsPerRow - 1)

    return (
      <View style={[styles.row, { marginBottom: adjustedMargin }]}>
        {items.map(item =>
          this.props.renderItem(item, itemWidth, this.props.onItemTouch))}
        {itemsPerRow - items.length > 0 &&
          <View style={{ width: itemWidth * (itemsPerRow - items.length) }} />
        }
      </View>
    )
  }

  render() {
    const rows = this.buildRows(this.props.data, this.props.itemsPerRow)

    return (
      <ListView
        renderScrollComponent={props => <InfiniteScrollView {...props} />}
        {...this.props}
        dataSource={this.state.data.cloneWithRows(rows)}
        renderRow={this.renderRow}
        style={{ flex: 1 }}
        canLoadMore
        onLoadMoreAsync={this.props.loadMoreContentAsync}
      />
    )
  }
}

ImageGrid.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  onItemTouch: PropTypes.func.isRequired,
  loadMoreContentAsync: PropTypes.func.isRequired,
  itemsPerRow: PropTypes.number.isRequired,
  itemMargin: PropTypes.number,
  deviceWidth: PropTypes.number.isRequired
}

ImageGrid.defaultProps = {
  itemMargin: 0
}

export default ImageGrid
