import { Dimensions, FlatList } from "react-native";
import { ProductCard } from "../../components/ProductCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { HomeHeader } from "../../components/HomeHeader";
import { CategoriesModal } from "../../components/CAtegoriesModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../hooks/useProduct";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabParamList, RootStackParamList } from "../../types/navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Product } from "../../types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen = ({ navigation }: Props) => {
  const { classes } = useTheme();
  const { user } = useAuth();
  const { products, loading, initialLoad, hasMore, loadMore } = useProducts();
  const { categories } = useCategories();

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  useEffect(() => {
    initialLoad();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedCategory === "all" || p.category === selectedCategory),
    );
  }, [products, searchText, selectedCategory]);

  const featuredProducts = useMemo(() => products.slice(0, 5), [products]);

  return (
    <SafeAreaView className={`flex-1 ${classes.background}`}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={useCallback(
          ({ item }: { item: Product }) => (
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate("ProductDetails", { product: item })
              }
            />
          ),
          [navigation],
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
          gap: 12,
        }}
        onEndReached={() => !loading && hasMore && loadMore()}
        ListHeaderComponent={
          <HomeHeader
            user={user}
            classes={classes}
            greeting={getGreeting()}
            searchText={searchText}
            setSearchText={setSearchText}
            featuredProducts={featuredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onSeeAllCategories={() => setShowCategoriesModal(true)}
            activeSlide={activeSlide}
            onCarouselScroll={(e) =>
              setActiveSlide(
                Math.round(
                  e.nativeEvent.contentOffset.x /
                    Dimensions.get("window").width,
                ),
              )
            }
          />
        }
      />
      <CategoriesModal
        visible={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </SafeAreaView>
  );
};
