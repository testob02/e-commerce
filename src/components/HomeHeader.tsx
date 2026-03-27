import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types";

const { width } = Dimensions.get("window");

interface HomeHeaderProps {
  user: any;
  classes: any;
  greeting: string;
  searchText: string;
  setSearchText: (text: string) => void;
  featuredProducts: Product[];
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (cat: string) => void;
  onSeeAllCategories: () => void;
  activeSlide: number;
  onCarouselScroll: (event: any) => void;
}

export const HomeHeader = (props: HomeHeaderProps) => {
  const {
    classes,
    user,
    searchText,
    setSearchText,
    featuredProducts,
    categories,
    selectedCategory,
    onCategorySelect,
    onSeeAllCategories,
    onCarouselScroll,
    activeSlide,
    greeting,
  } = props;

  const renderCarouselItem = ({ item }: { item: Product }) => (
    <View style={{ width }}>
      <View
        style={{
          width: width - 32,
          marginHorizontal: 16,
          height: 200,
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/30" />
        <View className="absolute bottom-0 left-0 right-0 p-5 bg-black/40">
          <Text className="text-white font-bold text-lg" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-blue-300 font-bold">${item.price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="pb-4">
      <View className="flex-row justify-between items-center px-4 pt-4 mb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </View>
          <View>
            <Text className={`text-xs ${classes.textMuted}`}>
              Hey, {user?.name?.split(" ")[0] ?? "there"}
            </Text>
            <Text className={`text-lg font-bold ${classes.textPrimary}`}>
              {greeting} 👋
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className={`w-12 h-12 rounded-full items-center justify-center border ${classes.border} ${classes.surface}`}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={classes.isDark ? "#94a3b8" : "#1e293b"}
          />
        </TouchableOpacity>
      </View>

      <View
        className={`flex-row items-center mx-4 mb-6 px-4 rounded-2xl border ${classes.inputBg} ${classes.border}`}
      >
        <Ionicons name="search-outline" size={20} color="#64748b" />
        <TextInput
          placeholder="Search products..."
          placeholderTextColor="#64748b"
          value={searchText}
          onChangeText={setSearchText}
          className={`flex-1 py-4 ml-2 ${classes.textPrimary}`}
        />
      </View>

      {searchText === "" && selectedCategory === "all" && (
        <View className="mb-6">
          <FlatList
            data={featuredProducts}
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
          />
          <View className="flex-row justify-center mt-4 gap-2">
            {featuredProducts.map((_, i) => (
              <View
                key={i}
                className={`h-1.5 rounded-full ${activeSlide === i ? "w-6 bg-blue-500" : "w-1.5 bg-slate-700"}`}
              />
            ))}
          </View>
        </View>
      )}

      <View>
        <View className="flex-row justify-between items-center px-4 mb-3">
          <Text className={`text-lg font-bold ${classes.textPrimary}`}>
            Categories
          </Text>
          <TouchableOpacity onPress={onSeeAllCategories}>
            <Text className="text-blue-500 font-semibold">See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          <Pill
            label="All"
            active={selectedCategory === "all"}
            onPress={() => onCategorySelect("all")}
            theme={classes}
          />
          {categories.map((cat) => (
            <Pill
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onPress={() => onCategorySelect(cat)}
              theme={classes}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const Pill = ({ label, active, onPress, theme }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-6 py-2.5 rounded-full border ${active ? "bg-blue-600 border-blue-600" : `${theme.surface} border-slate-800`}`}
  >
    <Text
      className={`font-medium capitalize ${active ? "text-white" : theme.textPrimary}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
